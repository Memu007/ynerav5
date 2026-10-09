"""Ynera Rama — display typeface grown from the approved Ynera logo lettering.

The five logo letters (Y n e r a) are imported from brand/ynera-lockup.svg and
every other glyph is drawn to their measurements: stem 105, x-height 518,
cap 700, round bowls, 45-degree cut terminals, slanted stem entries.

Rebuild:  python3 -m pip install fonttools brotli skia-pathops
          python3 design/propuestas/2026-10-09-rama/build-rama.py
Outputs:  fonts/ynera-rama.ttf and fonts/ynera-rama.woff2 (repo root).
"""
import math, re, sys, pathlib, unicodedata
from functools import reduce
from pathops import Path, PathOp, op
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.transformPen import TransformPen
from fontTools.svgLib.path import parse_path
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parents[2]

# ---------- measurements taken from the logo (logo unit x 7) ----------
SV, SH = 105, 94          # lowercase vertical stem / horizontal stroke
CSV, CSH = 112, 98        # capitals
X, CAP, ASC, DESC = 518, 700, 742, -200
OS = 12                   # overshoot of rounds below baseline / above caps
BAR = 80                  # crossbars (logo e bar = 77)
ENT = 44                  # rise of the slanted stem entry (logo n, r)
K = 0.56                  # curve tension: a little squarer than a circle

# ---------- geometry helpers ----------
def U(*ps):
    ps = [p for p in ps if p is not None]
    return reduce(lambda a, b: op(a, b, PathOp.UNION, fix_winding=True), ps)
def D(a, *bs):
    for b in bs: a = op(a, b, PathOp.DIFFERENCE, fix_winding=True)
    return a
def I(a, b): return op(a, b, PathOp.INTERSECTION, fix_winding=True)

class Cn:
    """Closed contour drawn with lines and quarter-ellipse arcs."""
    def __init__(s, x, y):
        s.p = Path(); s.pen = s.p.getPen(); s.pen.moveTo((x, y)); s.c = (x, y)
    def L(s, x, y): s.pen.lineTo((x, y)); s.c = (x, y); return s
    def ev(s, x, y, k=K):   # arc leaving vertically, arriving horizontally
        x0, y0 = s.c; s.pen.curveTo((x0, y0 + k*(y-y0)), (x - k*(x-x0), y), (x, y)); s.c = (x, y); return s
    def eh(s, x, y, k=K):   # arc leaving horizontally, arriving vertically
        x0, y0 = s.c; s.pen.curveTo((x0 + k*(x-x0), y0), (x, y - k*(y-y0)), (x, y)); s.c = (x, y); return s
    def C(s, a, b, c): s.pen.curveTo(a, b, c); s.c = c; return s
    def z(s): s.pen.closePath(); return s.p

def poly(*pts):
    c = Cn(*pts[0])
    for p in pts[1:]: c.L(*p)
    return c.z()
def rect(x0, y0, x1, y1): return poly((x0, y0), (x1, y0), (x1, y1), (x0, y1))
def ell(cx, cy, rx, ry, k=K):
    return Cn(cx-rx, cy).ev(cx, cy+ry, k).eh(cx+rx, cy, k).ev(cx, cy-ry, k).eh(cx-rx, cy, k).z()
def ring(cx, cy, rx, ry, tv, th, dx=0, grow=0):
    return D(ell(cx, cy, rx, ry), ell(cx+dx, cy, rx-tv+grow, ry-th))
def diag(xt, yt, xb, yb, hw):
    """Diagonal stroke with horizontal cuts; xt/xb are stroke centres."""
    return poly((xb-hw/2, yb), (xb+hw/2, yb), (xt+hw/2, yt), (xt-hw/2, yt))
def tf(p, a=1, b=0, c=0, d=1, e=0, f=0):
    out = Path(); p.draw(TransformPen(out.getPen(), (a, b, c, d, e, f)))
    return U(out)
def move(p, dx, dy=0): return tf(p, e=dx, f=dy)
def flipx(p, w): return tf(p, a=-1, e=w)
def rot180(p, w, h): return tf(p, a=-1, d=-1, e=w, f=h)
def bounds(p): return p.bounds
def wedge(ax, ay, L=1600):
    """Opening to the right with +-45 degree sides: the logo terminal cut."""
    return poly((ax, ay), (ax+L, ay+L), (ax+L, ay-L))

def stroke(start, *segs, wv=SV, wh=SH, m0=1, m1=1, ramp=2):
    """Expand a spine into an outline with an elliptical pen (vertical strokes
    wv wide, horizontal strokes wh). Ends are cut square to the spine, so a
    spine that ends at 45 degrees gets the logo terminal. m0/m1 thin the
    first/last pieces where a stroke grows out of a stem."""
    cubs = []; cur = start
    for s in segs:
        if len(s) == 2:
            p3 = s; p1 = (cur[0]+(p3[0]-cur[0])/3, cur[1]+(p3[1]-cur[1])/3); p2 = (cur[0]+2*(p3[0]-cur[0])/3, cur[1]+2*(p3[1]-cur[1])/3)
        else: p1, p2, p3 = s
        cubs.append((cur, p1, p2, p3)); cur = p3
    def split(c, t):
        l = lambda a, b: (a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t)
        p0, p1, p2, p3 = c; a = l(p0, p1); b = l(p1, p2); cc = l(p2, p3); d = l(a, b); e = l(b, cc); f = l(d, e)
        return (p0, a, d, f), (f, e, cc, p3)
    parts = []
    for c in cubs:
        a, b = split(c, .5); a1, a2 = split(a, .5); b1, b2 = split(b, .5); parts += [a1, a2, b1, b2]
    n = len(parts)
    def mult(i):   # i = node index 0..n
        r = 1
        if m0 != 1 and i < ramp: r = min(r, m0 + (1-m0)*i/ramp)
        if m1 != 1 and n-i < ramp: r = min(r, m1 + (1-m1)*(n-i)/ramp)
        return r
    def unit(a, b):
        dx, dy = b[0]-a[0], b[1]-a[1]; l = math.hypot(dx, dy) or 1; return dx/l, dy/l
    def off(pt, d, sign, m):
        h = math.hypot(wv*d[1], wh*d[0])/2*m
        return (pt[0] - d[1]*h*sign, pt[1] + d[0]*h*sign)
    left = []; right = []
    for i, (p0, p1, p2, p3) in enumerate(parts):
        d0 = unit(p0, p1) if p1 != p0 else unit(p0, p2); d3 = unit(p2, p3) if p3 != p2 else unit(p1, p3)
        for sign, acc in ((1, left), (-1, right)):
            a0 = off(p0, d0, sign, mult(i)); a3 = off(p3, d3, sign, mult(i+1))
            ch = math.hypot(p3[0]-p0[0], p3[1]-p0[1]) or 1; s = math.hypot(a3[0]-a0[0], a3[1]-a0[1])/ch
            a1 = (a0[0]+(p1[0]-p0[0])*s, a0[1]+(p1[1]-p0[1])*s); a2 = (a3[0]+(p2[0]-p3[0])*s, a3[1]+(p2[1]-p3[1])*s)
            acc.append((a0, a1, a2, a3))
    out = Path(); pen = out.getPen(); pen.moveTo(left[0][0])
    for a0, a1, a2, a3 in left: pen.curveTo(a1, a2, a3)
    pen.lineTo(right[-1][3])
    for a0, a1, a2, a3 in reversed(right): pen.curveTo(a2, a1, a0)
    pen.closePath()
    return U(out)

# ---------- logo letters, imported verbatim ----------
svg = (ROOT/'brand'/'ynera-lockup.svg').read_text()
def logo(letter):
    m = re.search(r'<path id="letter-%s"([^>]*)d="([^"]+)"' % letter, svg)
    pre, d = m[1], m[2]; sx, dx = 1, 0
    t = re.search(r'translate\(([-\d.]+)', pre); s = re.search(r'scale\(([-\d.]+)', pre)
    if t: dx = float(t[1])
    if s: sx = float(s[1])
    out = Path(); parse_path(d, TransformPen(out.getPen(), (7*sx, 0, 0, -7, 7*dx, 756)))
    out = U(out); x0 = out.bounds[0]
    return move(out, -x0)

# ---------- shared parts ----------
def stem(x, y0, y1, slant=True, w=SV):
    return poly((x, y0), (x+w, y0), (x+w, y1), (x, y1-ENT)) if slant else rect(x, y0, x+w, y1)
def arch(xj, w, foot=0):
    """Shoulder growing out of a stem, measured on the logo n (w=336)."""
    r = w/336; xr = xj+w; xp = xr-175*r; xpi = xp-21*r
    return (Cn(xj-10, 300).ev(xp, X).eh(xr, 308).L(xr, foot).L(xr-SV, foot).L(xr-SV, 301)
            .ev(xpi, X-98).eh(xj, 266).L(xj-10, 266).z())
def bowl(x0, w, side, top=X, bot=-OS, tv=SV, th=SH):
    rx = w/2; ry = (top-bot)/2; cy = (top+bot)/2; t = 18
    return D(ell(x0+rx, cy, rx, ry), ell(x0+rx+(-t/2 if side == 'l' else t/2), cy, rx-tv+t/2, ry-th))
def dot(cx, cy, r=66): return ell(cx, cy, r, r, .5523)
def s_spine(x0, w, yb, yt, wv, wh):
    q = lambda u, v: (x0+u*w, yb+v*(yt-yb))
    return stroke(q(.8625, .837), (q(.775, .918), q(.675, 1), q(.5, 1)), (q(.275, 1), q(.155, .906), q(.155, .773)),
                  (q(.155, .608), q(.325, .557), q(.5125, .505)), (q(.7125, .447), q(.8625, .39), q(.8625, .229)),
                  (q(.8625, .092), q(.725, 0), q(.5, 0)), (q(.3125, 0), q(.2125, .098), q(.12, .183)), wv=wv, wh=wh)

G = {}   # char -> (path, lsb, rsb)
S_, R_, D_ = 54, 32, 10          # lowercase sidebearings: straight, round, diagonal
CS, CR, CD = 64, 40, 12          # capitals
def put(ch, p, l, r): G[ch] = (U(p), l, r)

# ---------- lowercase ----------
n_ = U(stem(0, 0, X), arch(SV, 336))
put('n', logo('n'), S_, S_)
put('e', logo('e'), R_, 26)
put('r', logo('r'), S_, 4)
put('a', logo('a'), 30, 50)
put('h', U(stem(0, 0, ASC), arch(SV, 336)), S_, S_)
put('m', U(stem(0, 0, X), arch(SV, 296), arch(SV+296, 296)), S_, S_)
put('u', rot180(n_, 441, X-OS), S_, S_)
put('i', U(stem(0, 0, X), dot(SV/2, 672)), S_, S_)
put('ı', stem(0, 0, X), S_, S_)
put('l', stem(0, 0, ASC), S_, S_)
put('o', ring(240, (X-OS)/2, 240, (X+OS)/2, SV, SH), R_, R_)
cy = (X-OS)/2
put('c', D(ring(225, cy, 225, (X+OS)/2, SV, SH), wedge(225+72, cy)), R_, 14)
put('b', U(stem(0, 0, ASC), bowl(18, 440, 'l')), S_, R_)
put('d', U(stem(353, 0, ASC), bowl(0, 440, 'r')), R_, S_)
put('p', U(stem(0, DESC, X), bowl(18, 440, 'l')), S_, R_)
put('q', U(rect(353, DESC, 458, X), bowl(0, 440, 'r')), R_, S_)
put('g', U(rect(353, -40, 458, X), bowl(0, 440, 'r'),
           stroke((405.5, 0), ((405.5, -125), (330, -160), (232, -160)), ((165, -160), (118, -146), (72, -100)))), R_, S_)
put('s', s_spine(0, 400, 35, 471, SV, SH), 26, 26)
put('f', U(rect(70, 0, 175, 560), stroke((122.5, 520), ((122.5, 640), (165, 695), (240, 695)), ((282, 695), (310, 683), (338, 655))),
           rect(0, X-BAR-8, 300, X-8)), 14, 0)
put('t', U(poly((70, 300), (175, 300), (175, 660), (70, 660-ENT)),
           stroke((122.5, 320), (122.5, 160), ((122.5, 75), (165, 41), (235, 41)), ((277, 41), (303, 53), (333, 83))),
           rect(0, X-BAR-8, 305, X-8)), 14, 8)
put('j', U(stem(120, -40, X), stroke((172.5, 0), ((172.5, -125), (115, -160), (40, -160)), ((15, -160), (0, -156), (-20, -145))), dot(172.5, 672)), -20, S_)
put('k', U(stem(0, 0, ASC), I(diag(425, X, 95, 150, 122), rect(SV/2, 0, 900, X)), diag(262, 336, 442, 0, 122)), S_, D_)
put('v', U(diag(57, X, 235, 0, 114), diag(413, X, 235, 0, 114)), D_, D_)
put('w', U(diag(52, X, 196, 0, 104), diag(362, X, 196, 0, 104), diag(362, X, 528, 0, 104), diag(672, X, 528, 0, 104)), D_, D_)
put('x', U(diag(62, X, 392, 0, 118), diag(390, X, 60, 0, 118)), D_, D_)
put('y', U(diag(57, X, 236, 20, 114), diag(413, X, 150, DESC, 114)), D_, D_)
put('z', U(rect(8, X-SH, 405, X), rect(0, 0, 412, SH), poly((405-138, X-SH), (405, X-SH), (138, SH), (0, SH))), 22, 22)

# ---------- capitals ----------
put('Y', logo('Y'), CD, CD)
put('H', U(rect(0, 0, CSV, CAP), rect(480, 0, 592, CAP), rect(0, 312, 592, 312+88)), CS, CS)
put('I', rect(0, 0, CSV, CAP), CS, CS)
put('E', U(rect(0, 0, CSV, CAP), rect(0, CAP-CSH, 440, CAP), rect(0, 0, 452, CSH), rect(0, 312, 405, 400)), CS, 30)
put('F', U(rect(0, 0, CSV, CAP), rect(0, CAP-CSH, 440, CAP), rect(0, 296, 400, 384)), CS, 22)
put('L', U(rect(0, 0, CSV, CAP), rect(0, 0, 430, CSH)), CS, 18)
put('T', U(rect(0, CAP-CSH, 550, CAP), rect(219, 0, 331, CAP)), 20, 20)
def A_(w=660, hw=126, sp=8):
    hull = poly((0, 0), (w, 0), (w/2+sp+hw/2, CAP), (w/2-sp-hw/2, CAP))
    return U(diag(w/2-sp, CAP, hw/2, 0, hw), diag(w/2+sp, CAP, w-hw/2, 0, hw), I(rect(0, 168, w, 250), hull))
put('A', A_(), CD, CD)
put('V', U(diag(63, CAP, 312, 0, 126), diag(561, CAP, 312, 0, 126)), CD, CD)
put('W', U(diag(58, CAP, 255, 0, 116), diag(455, CAP, 255, 0, 116), diag(455, CAP, 655, 0, 116), diag(852, CAP, 655, 0, 116)), CD, CD)
put('M', U(rect(0, 0, CSV, CAP), rect(658, 0, 770, CAP), diag(64, CAP, 385, 0, 128), diag(706, CAP, 385, 0, 128)), CS, CS)
put('N', U(rect(0, 0, CSV, CAP), rect(498, 0, 610, CAP), diag(66, CAP, 544, 0, 132)), CS, CS)
put('K', U(rect(0, 0, CSV, CAP), I(diag(505, CAP, 90, 215, 132), rect(CSV/2, 0, 900, CAP)), diag(274, 430, 522, 0, 132)), CS, CD)
put('X', U(diag(70, CAP, 535, 0, 130), diag(530, CAP, 65, 0, 130)), CD, CD)
put('Z', U(rect(15, CAP-CSH, 545, CAP), rect(0, 0, 560, CSH), poly((545-150, CAP-CSH), (545, CAP-CSH), (150, CSH), (0, CSH))), 28, 28)
ccy = CAP/2
put('O', ring(335, ccy, 335, ccy+OS, CSV, CSH), CR, CR)
put('Q', U(ring(335, ccy, 335, ccy+OS, CSV, CSH), diag(375, 175, 560, -85, 122)), CR, CR)
put('C', D(ring(310, ccy, 310, ccy+OS, CSV, CSH), wedge(310+105, ccy)), CR, 18)
put('G', U(D(ring(315, ccy, 315, ccy+OS, CSV, CSH), poly((455, 388), (1400, 1333), (1400, 388))), rect(335, 300, 630, 388)), CR, 34)
def bowlcap(y0, y1, xr, xa=150, th=CSH, tv=CSV):
    ym = (y0+y1)/2
    return D(Cn(0, y0).L(xa, y0).eh(xr, ym).ev(xa, y1).L(0, y1).z(),
             Cn(0, y0+th).L(xa, y0+th).eh(xr-tv, ym).ev(xa, y1-th).L(0, y1-th).z())
put('D', U(rect(0, 0, CSV, CAP), bowlcap(0, CAP, 610, 215)), CS, CR)
put('P', U(rect(0, 0, CSV, CAP), bowlcap(285, CAP, 510, 265)), CS, 26)
put('R', U(rect(0, 0, CSV, CAP), bowlcap(300, CAP, 510, 265), diag(300, 330, 500, 0, 132)), CS, 14)
put('B', U(rect(0, 0, CSV, CAP), bowlcap(312, CAP, 490, 270, th=92), bowlcap(0, 404, 530, 280, th=CSH)), CS, 30)
put('S', s_spine(0, 520, 37, 663, CSV, CSH), 34, 34)
put('J', U(rect(300, 190, 412, CAP), stroke((356, 215), ((356, 90), (290, 37), (195, 37)), ((115, 37), (70, 72), (30, 112)), wv=CSV, wh=CSH)), 14, CS)
put('U', Cn(0, CAP).L(0, 295).ev(300, -OS).eh(600, 295).L(600, CAP).L(600-CSV, CAP).L(600-CSV, 295).ev(300, -OS+CSH).eh(CSV, 295).L(CSV, CAP).z(), CS, CS)

# ---------- figures ----------
FS = 36
put('0', ring(262, ccy, 262, ccy+OS, CSV, CSH), FS, FS)
put('1', U(rect(190, 0, 302, CAP), I(diag(246, CAP, 40, 478, 150), rect(0, 0, 302, CAP))), 50, 70)
put('2', U(I(stroke((62, 545), ((100, 583), (160, 663), (252, 663)), ((350, 663), (425, 610), (425, 518)), ((425, 435), (370, 375), (295, 305)), (20, 30), wv=CSV, wh=CSH), rect(18, 0, 900, 900)),
           rect(18, 0, 478, CSH)), FS, FS)
put('3', U(stroke((58, 560), ((95, 597), (160, 663), (250, 663)), ((340, 663), (410, 618), (410, 530)), ((410, 450), (345, 400), (230, 400)), wv=CSV, wh=92),
           stroke((230, 396), ((360, 396), (440, 325), (440, 212)), ((440, 100), (355, 37), (245, 37)), ((150, 37), (92, 85), (52, 128)), wv=CSV, wh=92)), FS, FS)
put('4', U(rect(345, 0, 457, CAP), rect(0, 150, 550, 238), I(diag(395, CAP, 64, 238, 128), rect(0, 150, 457, CAP))), 24, 24)
put('5', U(rect(95, CAP-CSH, 450, CAP), rect(95, 360, 200, CAP),
           stroke((110, 370), ((165, 425), (225, 452), (285, 452)), ((385, 452), (450, 365), (450, 245)), ((450, 120), (365, 37), (255, 37)), ((160, 37), (100, 88), (58, 130)), wv=CSV, wh=92)), FS, FS)
six = U(ring(262, 222, 230, 234, CSV, 94), stroke((88, 225), ((88, 470), (195, 663), (330, 663)), ((385, 663), (425, 648), (462, 611)), wv=CSV, wh=CSH))
put('6', six, FS, FS)
put('9', rot180(six, 524, CAP), FS, FS)
put('7', U(rect(0, CAP-CSH, 480, CAP), diag(416, CAP, 185, 0, 128)), 30, 20)
put('8', U(ring(240, 525, 198, 187, 104, 90), ring(240, 192, 240, 204, CSV, 94)), FS, FS)

# ---------- punctuation ----------
comma_ = poly((38, 128), (160, 128), (88, -118), (4, -118))
quote_ = move(comma_, 0, 700-128-10)
put('.', dot(68, 62, 68), 34, 34)
put(',', comma_, 28, 28)
put(':', U(dot(68, 62, 68), dot(68, 410, 68)), 40, 40)
put(';', U(comma_, dot(92, 410, 68)), 36, 36)
put('·', dot(68, 300, 68), 40, 40)
put('…', U(dot(68, 62, 68), dot(288, 62, 68), dot(508, 62, 68)), 40, 40)
bang = U(poly((0, CAP), (118, CAP), (96, 225), (22, 225)), dot(59, 62, 68))
put('!', bang, 50, 50)
put('¡', tf(bang, d=-1, f=X), 50, 50)
ques = U(stroke((40, 545), ((78, 583), (135, 663), (228, 663)), ((325, 663), (388, 612), (388, 528)), ((388, 455), (335, 420), (285, 380)), ((245, 348), (228, 320), (228, 268)), (228, 215), wv=CSV, wh=CSH), dot(228, 62, 68))
put('?', ques, 30, 30)
put('¿', rot180(ques, 440, X), 30, 30)
put('-', rect(0, 228, 300, 314), 40, 40)
put('–', rect(0, 232, 500, 312), 40, 40)
put('—', rect(0, 232, 880, 312), 40, 40)
put('’', quote_, 26, 26)
put('‘', rot180(quote_, 164, 2*700-128-10-118+128), 26, 26)
put('“', U(rot180(quote_, 164, 1254), move(rot180(quote_, 164, 1254), 200)), 26, 26)
put('”', U(quote_, move(quote_, 200)), 26, 26)
put("'", poly((0, 740), (104, 740), (86, 480), (18, 480)), 40, 40)
put('"', U(poly((0, 740), (104, 740), (86, 480), (18, 480)), poly((190, 740), (294, 740), (276, 480), (208, 480))), 40, 40)
paren = stroke((235, -165), ((75, 30), (75, 560), (235, 755)), wv=96, wh=96)
put('(', I(paren, rect(0, -150, 400, 740)), 40, 10)
put(')', flipx(I(paren, rect(0, -150, 400, 740)), bounds(paren)[2]+bounds(paren)[0]), 10, 40)
put('/', diag(340, 760, 50, -130, 98), 10, 10)
put('+', U(rect(0, 258, 420, 342), rect(168, 90, 252, 510)), 44, 44)
put('=', U(rect(0, 360, 420, 440), rect(0, 160, 420, 240)), 44, 44)
chev = U(diag(180, 455, 52, 264, 96), diag(52, 268, 180, 77, 96))
put('«', U(chev, move(chev, 200)), 36, 36)
put('»', flipx(U(chev, move(chev, 200)), 428), 36, 36)
put('&', U(stroke((560, 0), (205, 455), ((150, 525), (165, 663), (290, 663)), ((395, 663), (415, 545), (335, 480)),
                  ((255, 415), (60, 350), (60, 200)), ((60, 90), (150, 37), (270, 37)), ((410, 37), (500, 150), (525, 345)), wv=CSV, wh=92)), 34, 14)
cc = D(ring(310, ccy, 310, ccy+OS, CSV, CSH), wedge(310+105, ccy))
put('©', U(ring(400, 350, 400, 400, 56, 56), tf(cc, a=.56, d=.56, e=400-.56*295, f=350-.56*350)), 40, 40)

# ---------- accents ----------
ACC = {
 'acute': move(poly((-45, 0), (25, 0), (120, 165), (8, 165)), -32),
 'grave': flipx(move(poly((-45, 0), (25, 0), (120, 165), (8, 165)), -32), 0),
 'circ': U(diag(0, 165, -112, 0, 84), diag(0, 165, 112, 0, 84)),
 'dier': U(dot(-96, 60, 56), dot(96, 60, 56)),
 'tilde': move(stroke((-150, 40), ((-100, 150), (-40, 125), (0, 82)), ((40, 40), (100, 15), (150, 125)), wv=76, wh=76), 0, 10),
}
ced = U(stroke((20, 10), (2, -50), wv=62, wh=62), stroke((-10, -52), ((95, -45), (100, -168), (-5, -168)), ((-48, -168), (-72, -158), (-98, -134)), wv=62, wh=62))
COMB = {'́': 'acute', '̀': 'grave', '̂': 'circ', '̈': 'dier', '̃': 'tilde'}
def accented(ch):
    base, mark = unicodedata.normalize('NFD', ch)
    src = 'ı' if base == 'i' else base
    p, l, r = G[src]; x0, y0, x1, y1 = p.bounds
    if mark == '̧':
        cx = (x0+x1)/2 + (10 if base in 'cC' else 0)
        put(ch, U(p, move(ced, cx, 0)), l, r); return
    cx = (x0+x1)/2
    if base == 'a': cx += 12
    if base in 'ACOEIUN' or base.isupper(): y = CAP + 48
    else: y = X + 72
    put(ch, U(p, move(ACC[COMB[mark]], cx, y)), l, r)
for ch in 'áéíóúàèìòùâêîôûäëïöüñãõÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÄËÏÖÜÑÃÕÿçÇ': accented(ch)

# ---------- metrics, kerning ----------
order = ['.notdef', 'space'] + ['uni%04X' % ord(c) for c in G]
name = {c: 'uni%04X' % ord(c) for c in G}
final = {}; adv = {'.notdef': 500, 'space': 232}
for ch, (p, l, r) in G.items():
    x0, y0, x1, y1 = p.bounds
    q = move(p, l-x0); final[ch] = q; adv[name[ch]] = round(l + (x1-x0) + r)

def flatten(p):
    rec = RecordingPen(); p.draw(rec); polys = []; cur = None; pts = []
    for op_, a in rec.value:
        if op_ == 'moveTo': pts = [a[0]]; cur = a[0]
        elif op_ == 'lineTo': pts.append(a[0]); cur = a[0]
        elif op_ == 'curveTo':
            p0 = cur; p1, p2, p3 = a
            for i in range(1, 9):
                t = i/8; v = 1-t
                pts.append((v**3*p0[0]+3*v*v*t*p1[0]+3*v*t*t*p2[0]+t**3*p3[0], v**3*p0[1]+3*v*v*t*p1[1]+3*v*t*t*p2[1]+t**3*p3[1]))
            cur = p3
        elif op_ == 'qCurveTo':
            p0 = cur; p1, p2 = a[-2], a[-1]
            for i in range(1, 7):
                t = i/6; v = 1-t
                pts.append((v*v*p0[0]+2*v*t*p1[0]+t*t*p2[0], v*v*p0[1]+2*v*t*p1[1]+t*t*p2[1]))
            cur = p2
        elif op_ in ('closePath', 'endPath'):
            if pts: polys.append(pts)
            pts = []
    return polys
BANDS = list(range(DESC, 921, 20))
def profile(ch):
    lo = {}; hi = {}
    for pts in flatten(final[ch]):
        for (xa, ya), (xb, yb) in zip(pts, pts[1:]+pts[:1]):
            if ya == yb: continue
            for y in BANDS:
                yy = y+10
                if min(ya, yb) <= yy < max(ya, yb):
                    x = xa+(yy-ya)*(xb-xa)/(yb-ya); lo[y] = min(lo.get(y, 1e9), x); hi[y] = max(hi.get(y, -1e9), x)
    def smear(d, f):
        out = {}
        for y in BANDS:
            v = [d[k] for k in (y-40, y-20, y, y+20, y+40) if k in d]
            if v: out[y] = f(v)
        return out
    return smear(lo, min), smear(hi, max)
PROF = {ch: profile(ch) for ch in final}
def gapstat(a, b):
    ra = PROF[a][1]; lb = PROF[b][0]; A = adv[name[a]]
    g = [A-ra[y]+lb[y] for y in BANDS if y in ra and y in lb]
    if len(g) < 4: return None
    m = min(g); return m, sum(min(v, m+130) for v in g)/len(g)
REF_L = gapstat('n', 'o')[1]; REF_C = gapstat('H', 'O')[1]; REF_M = (REF_L+REF_C)/2
letters = [c for c in final if c.isalpha()]
punct = [c for c in '.,:;!?’”“‘-–—)(/«»&…']
pairs = {}
for a in letters+punct:
    for b in letters+punct:
        if a in punct and b in punct: continue
        st = gapstat(a, b)
        if not st: continue
        m, g = st
        ref = REF_L if (a.islower() or a in punct) and (b.islower() or b in punct) else REF_C if a.isupper() and b.isupper() else REF_M
        k = max(-130, min(36, ref-g))
        if m + k < 30: k = 30 - m
        if a in punct or b in punct: k *= .7
        k = int(round(k/2)*2)
        if abs(k) >= 12: pairs[(a, b)] = k

# ---------- write the font ----------
fb = FontBuilder(1000, isTTF=True)
fb.setupGlyphOrder(order)
cmap = {32: 'space', 160: 'space'}; cmap.update({ord(c): name[c] for c in G})
fb.setupCharacterMap(cmap)
glyphs = {}
empty = TTGlyphPen(None); glyphs['space'] = empty.glyph()
nd = TTGlyphPen(None)
for pts in ([(60, 0), (60, 700), (440, 700), (440, 0)], [(120, 60), (380, 60), (380, 640), (120, 640)]):
    nd.moveTo(pts[0]); [nd.lineTo(p) for p in pts[1:]]; nd.closePath()
glyphs['.notdef'] = nd.glyph()
lsbs = {'space': 0, '.notdef': 60}
for ch, p in final.items():
    pen = TTGlyphPen(None); p.draw(Cu2QuPen(pen, 0.6, reverse_direction=True))
    g = pen.glyph(); glyphs[name[ch]] = g
fb.setupGlyf(glyphs)
metrics = {}
for gn in order:
    g = fb.font['glyf'][gn]; g.recalcBounds(fb.font['glyf'])
    metrics[gn] = (adv[gn], g.xMin if g.numberOfContours else 0)
fb.setupHorizontalMetrics(metrics)
fb.setupHorizontalHeader(ascent=960, descent=-280)
fb.setupNameTable({'familyName': 'Ynera Rama', 'styleName': 'Regular', 'uniqueFontIdentifier': 'Ynera Rama 1.000',
                   'fullName': 'Ynera Rama', 'psName': 'YneraRama-Regular', 'version': 'Version 1.000',
                   'designer': 'Ynera', 'description': 'Display typeface drawn from the Ynera logo lettering.'})
fb.setupOS2(sTypoAscender=960, sTypoDescender=-280, sTypoLineGap=0, usWinAscent=1000, usWinDescent=300,
            sxHeight=X, sCapHeight=CAP, usWeightClass=400, fsSelection=0x40)
fb.setupPost()
fea = 'languagesystem DFLT dflt;\nlanguagesystem latn dflt;\nfeature kern {\n' + ''.join(
    '  pos %s %s %d;\n' % (name[a], name[b], k) for (a, b), k in sorted(pairs.items())) + '} kern;\n'
addOpenTypeFeaturesFromString(fb.font, fea)
out = ROOT/'fonts'
fb.save(str(out/'ynera-rama.ttf'))
from fontTools.ttLib import TTFont
f = TTFont(str(out/'ynera-rama.ttf')); f.flavor = 'woff2'; f.save(str(out/'ynera-rama.woff2'))
print('glyphs', len(order), 'kern pairs', len(pairs), 'ttf', (out/'ynera-rama.ttf').stat().st_size, 'woff2', (out/'ynera-rama.woff2').stat().st_size)
print('refs', round(REF_L), round(REF_C))
