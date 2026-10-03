"""Original Ynera Bifurca display drawing. No source font is used.
Rebuild: python3 -m pip install fonttools brotli; python3 design/build-bifurca.py
The path vocabulary below is hand-drawn; contrast comes from a pen model.
"""
import math, pathlib, sys, unicodedata
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import newTable

OUT=pathlib.Path(__file__).resolve().parents[1]/'fonts'
glyphs={}; widths={}; cmap={}; shapes=[]

def polygon(p):
    # Same winding for every filled contour; overlaps are intentional.
    area=sum(p[i][0]*p[(i+1)%len(p)][1]-p[(i+1)%len(p)][0]*p[i][1] for i in range(len(p)))
    shapes.append(p if area<0 else p[::-1])

def stroke(points, weight=1):
    if len(points)<2:return
    a=[]; b=[]
    for i,(x,y) in enumerate(points):
        p=points[max(0,i-1)]; q=points[min(len(points)-1,i+1)]
        dx=q[0]-p[0];dy=q[1]-p[1]; l=math.hypot(dx,dy) or 1
        nx=-dy/l;ny=dx/l
        # An elliptical nib: 67-unit vertical stems, 22-unit cross strokes.
        # Optical weight gives mobile headings enough substance.
        r=weight*math.sqrt((33.5*nx)**2+(11*ny)**2)
        a.append((x+nx*r,y+ny*r));b.append((x-nx*r,y-ny*r))
    polygon(a+b[::-1])

def path(start,*segments,weight=1):
    pts=[start]; cur=start
    for s in segments:
        if len(s)==2:pts.append(s);cur=s
        else:
            c1=s[:2];c2=s[2:4];end=s[4:]
            for j in range(1,23):
                t=j/22;v=1-t
                pts.append((v**3*cur[0]+3*v*v*t*c1[0]+3*v*t*t*c2[0]+t**3*end[0],v**3*cur[1]+3*v*v*t*c1[1]+3*v*t*t*c2[1]+t**3*end[1]))
            cur=end
    stroke(pts,weight)

def stem(x,y0,y1,serifs=True,bottom=True):
    stroke([(x,y0),(x,y1)])
    if serifs:
        if bottom:polygon([(x-57,y0-3),(x+60,y0-3),(x+60,y0+9),(x+30,y0+16),(x-29,y0+16),(x-57,y0+9)])
        polygon([(x-57,y1-12),(x+30,y1+10),(x+29,y1-16),(x-29,y1-16),(x-57,y1-24)])

def dot(x,y,r=28):
    polygon([(x+math.cos(i*math.tau/24)*r,y+math.sin(i*math.tau/24)*r) for i in range(24)])

def oval(x0,y0,x1,y1):
    cx=(x0+x1)/2;cy=(y0+y1)/2; rx=(x1-x0)/2;ry=(y1-y0)/2;k=.5522848
    path((cx,y1),(cx+k*rx,y1,x1,cy+k*ry,x1,cy),(x1,cy-k*ry,cx+k*rx,y0,cx,y0),(cx-k*rx,y0,x0,cy-k*ry,x0,cy),(x0,cy+k*ry,cx-k*rx,y1,cx,y1))

def bowl(x,y0,y1,w):
    m=(y0+y1)/2
    path((x,y1),(x+w*.9,y1,x+w,y1-45,x+w,m),(x+w,y0+45,x+w*.9,y0,x,y0))

def build(char,w,fn):
    global shapes
    shapes=[];fn(); name='uni%04X'%ord(char)
    pen=TTGlyphPen(None)
    for contour in shapes:
        pen.moveTo(tuple(round(v) for v in contour[0]))
        for pt in contour[1:]:pen.lineTo(tuple(round(v) for v in pt))
        pen.closePath()
    g=pen.glyph();g._shapes=[p[:] for p in shapes]
    glyphs[name]=g;widths[name]=(w,0);cmap[ord(char)]=name

def cap(c):
    if c=='A':path((55,0),(284,710),(505,0));path((125,225),(432,225));stem(80,0,1);stem(484,0,1)
    elif c=='B':stem(100,0,700);bowl(100,345,700,322);bowl(100,0,345,350)
    elif c=='C':path((495,616),(405,755,68,755,68,350),(68,-55,406,-55,510,84));path((495,615),(492,700),weight=.7)
    elif c=='D':stem(100,0,700);bowl(100,0,700,410)
    elif c=='E':stem(100,0,700);path((100,700),(460,700),(468,636));path((100,357),(382,357));path((100,0),(474,0),(486,66))
    elif c=='F':stem(100,0,700);path((100,700),(460,700),(468,636));path((100,357),(380,357))
    elif c=='G':path((495,616),(405,755,68,755,68,350),(68,-55,415,-55,491,65));path((490,62),(490,301),(357,301))
    elif c=='H':stem(100,0,700);stem(490,0,700);path((100,348),(490,348))
    elif c=='I':stem(105,0,700)
    elif c=='J':stem(317,145,700,bottom=False);path((317,150),(317,-20,105,-40,70,106));dot(67,110,23)
    elif c=='K':stem(100,0,700);path((476,700),(100,291));path((255,463),(513,0))
    elif c=='L':stem(100,0,700);path((100,0),(456,0),(482,83))
    elif c=='M':stem(86,0,700);path((86,700),(338,95),(581,700));stem(581,0,700)
    elif c=='N':stem(90,0,700);path((90,700),(493,0));stem(493,0,700)
    elif c=='O':oval(67,-12,540,711)
    elif c=='P':stem(100,0,700);bowl(100,323,700,342)
    elif c=='Q':oval(67,-12,540,711);path((339,126),(417,-37,479,-110,592,-82))
    elif c=='R':stem(100,0,700);bowl(100,331,700,342);path((257,331),(348,242,384,-28,513,4))
    elif c=='S':path((458,610),(425,749,97,750,84,572),(70,388,455,413,466,205),(480,-51,125,-68,63,80));path((63,80),(63,166),weight=.7)
    elif c=='T':path((42,638),(51,700),(494,700),(502,638));stem(276,0,700)
    elif c=='U':stem(95,211,700,bottom=False);stem(496,211,700,bottom=False);path((95,215),(95,-92,496,-92,496,215))
    elif c=='V':path((52,700),(278,-7),(505,700))
    elif c=='W':path((48,700),(218,-6),(384,499),(545,-6),(727,700))
    elif c=='X':path((62,700),(498,0));path((490,700),(69,0))
    elif c=='Y':path((43,700),(284,351),(531,700));stem(284,0,351,serifs=False);polygon([(227,0),(344,0),(344,9),(314,16),(255,16),(227,9)])
    elif c=='Z':path((62,637),(65,700),(491,700),(59,0),(498,0),(506,72))

capwidth={'A':560,'B':520,'C':566,'D':581,'E':532,'F':510,'G':565,'H':590,'I':213,'J':390,'K':570,'L':530,'M':677,'N':591,'O':605,'P':514,'Q':629,'R':570,'S':528,'T':552,'U':592,'V':557,'W':777,'X':559,'Y':579,'Z':560}
for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':build(c,capwidth[c],lambda c=c:cap(c))

def lower(c):
    if c=='a':oval(65,-8,377,488);stem(377,0,476);path((377,9),(428,9))
    elif c=='b':stem(88,0,726);bowl(88,-7,485,300)
    elif c=='c':path((376,417),(274,558,67,509,67,235),(67,-43,291,-65,389,76));dot(363,415,22)
    elif c=='d':oval(67,-8,384,489);stem(384,0,726)
    elif c=='e':path((72,255),(384,255),(387,553,67,553,67,236),(67,-47,300,-58,393,72))
    elif c=='f':path((118,-4),(118,530),(118,721,267,786,323,689));path((53,478),(297,478));stem(118,0,1);dot(320,689,22)
    elif c=='g':oval(65,-8,377,488);stem(377,-141,476);path((377,-141),(377,-297,132,-298,90,-168))
    elif c=='h':stem(90,0,726);path((90,359),(134,549,375,530,375,317),(375,0));stem(375,0,1)
    elif c=='i':stem(99,0,476);dot(99,650,29)
    elif c=='j':stem(154,-104,476);path((154,-104),(154,-260,47,-275,17,-179));dot(154,650,29)
    elif c=='k':stem(89,0,726);path((380,478),(91,163));path((210,297),(406,0))
    elif c=='l':stem(100,0,726)
    elif c=='m':stem(87,0,476);path((87,351),(137,548,334,530,334,302),(334,0));path((334,351),(386,548,581,530,581,302),(581,0));stem(334,0,1);stem(581,0,1)
    elif c=='n':stem(90,0,476);path((90,359),(134,549,375,530,375,317),(375,0));stem(375,0,1)
    elif c=='o':oval(65,-9,395,489)
    elif c=='p':stem(88,-226,476);bowl(88,-7,485,300)
    elif c=='q':oval(67,-8,384,489);stem(384,-226,476)
    elif c=='r':stem(90,0,476);path((90,341),(140,510,263,520,307,434));dot(304,432,24)
    elif c=='s':path((330,419),(296,538,77,514,72,390),(66,265,336,269,342,125),(348,-35,116,-56,63,61));dot(65,65,19)
    elif c=='t':path((144,627),(144,112),(144,-31,259,-29,305,53));path((63,478),(305,478))
    elif c=='u':stem(87,178,476,bottom=False);stem(377,0,476);path((87,180),(87,-61,320,-51,377,140))
    elif c=='v':path((43,478),(224,-8),(405,478))
    elif c=='w':path((42,478),(179,-7),(329,357),(471,-7),(621,478))
    elif c=='x':path((56,478),(379,0));path((369,478),(63,0))
    elif c=='y':path((40,478),(225,5),(403,478));path((225,5),(148,-230,80,-257,41,-181))
    elif c=='z':path((67,432),(70,478),(366,478),(64,0),(376,0),(383,44))

lw={'a':465,'b':461,'c':450,'d':475,'e':456,'f':355,'g':460,'h':464,'i':207,'j':233,'k':458,'l':211,'m':675,'n':465,'o':464,'p':464,'q':472,'r':363,'s':406,'t':355,'u':465,'v':449,'w':665,'x':430,'y':451,'z':430}
for c in 'abcdefghijklmnopqrstuvwxyz':build(c,lw[c],lambda c=c:lower(c))

# Punctuation and numerals use original constructions, same optical pen.
nums={
'0':lambda:oval(68,-9,411,711),
'1':lambda:(path((91,577),(249,700),(249,0)),path((98,0),(389,0))),
'2':lambda:path((72,567),(76,762,413,778,418,565),(427,400,220,258,72,0),(430,0)),
'3':lambda:(path((76,612),(196,784,429,734,417,544),(409,400,324,357,221,352),(462,372,490,-49,232,-10),(147,-10,86,24,67,93))),
'4':lambda:(path((350,0),(350,703),(53,207),(449,207))),
'5':lambda:path((413,700),(93,700),(80,359),(261,471,425,362,425,200),(425,-56,125,-50,65,90)),
'6':lambda:(path((412,634),(256,819,68,622,68,301),(68,-123,425,-69,425,210),(425,465,148,445,73,265))),
'7':lambda:path((65,700),(433,700),(169,0)),
'8':lambda:(oval(86,360,405,710),oval(64,-10,427,360)),
'9':lambda:(path((82,59),(256,-120,423,57,423,401),(423,824,66,771,66,500),(66,245,342,255,416,440)))
}
for c,fn in nums.items():build(c,493,fn)
build(' ',255,lambda:None)
for c in '.:,;':
    def p(c=c):
        if c in '.:':dot(97,28,30)
        if c in ':;':dot(97,346,30)
        if c in ',;':path((102,46),(150,-34,88,-100,55,-111),weight=1.1)
    build(c,202,p)
build('!',205,lambda:(path((102,699),(102,173),weight=.9),dot(102,29,29)))
build('?',426,lambda:(path((66,573),(81,757,376,774,365,565),(357,440,224,455,219,245),(219,175)),dot(219,28,28)))
build('-',323,lambda:path((49,264),(276,264)))
build('—',850,lambda:path((49,264),(800,264)))
build('–',540,lambda:path((49,264),(493,264)))
build('/',395,lambda:path((35,-100),(353,731)))
build('(',296,lambda:path((237,745),(28,572,29,89,237,-164)))
build(')',296,lambda:path((59,745),(268,572,267,89,59,-164)))
build('&',674,lambda:(path((579,412),(392,-21,217,-45,107,74),(1,186,53,292,218,384),(460,522,391,755,213,688),(41,621,108,480,245,312),(441,60,518,-41,626,29)),path((446,411),(611,411))))
build('+',493,lambda:(path((246,104),(246,531)),path((49,318),(445,318))))
build('=',493,lambda:(path((49,251),(445,251)),path((49,410),(445,410))))
build('·',205,lambda:dot(102,280,25))
build('’',182,lambda:path((85,725),(138,652,98,577,59,554)))
build("'",182,lambda:path((89,700),(89,559)))
build('“',322,lambda:(path((120,731),(33,700,31,623,80,614)),path((263,731),(176,700,174,623,223,614))))
build('”',322,lambda:(path((59,731),(146,700,148,623,99,614)),path((202,731),(289,700,291,623,242,614))))
build('©',785,lambda:(oval(50,-5,735,704),path((526,501),(340,697,198,520,198,352),(198,80,435,82,536,200))))

# Spanish and common western-European accents are drawn as new contours.
for char in 'áéíóúÁÉÍÓÚñÑüÜàèìòùâêîôûäëïöÿçÇ':
    decomposed=unicodedata.normalize('NFD',char); base=decomposed[0];mark=decomposed[1]
    baseglyph=glyphs[cmap[ord(base)]]; w=widths[cmap[ord(base)]][0]; top=700 if base.isupper() else 488
    def accented(baseglyph=baseglyph,w=w,top=top,mark=mark,base=base):
        global shapes
        shapes=[p[:] for p in baseglyph._shapes]
        x=w/2
        if mark=='\u0301':path((x-35,top+80),(x+53,top+200),weight=.95)
        elif mark=='\u0300':path((x+35,top+80),(x-53,top+200),weight=.95)
        elif mark=='\u0308':dot(x-70,top+132,22);dot(x+70,top+132,22)
        elif mark=='\u0303':path((x-104,top+95),(x-56,top+199,x+32,top+58,x+103,top+154),weight=.95)
        elif mark=='\u0302':path((x-90,top+90),(x,top+187),(x+90,top+90),weight=.95)
        elif mark=='\u0327':path((x+20,-6),(x-5,-80),(x+95,-162,x-58,-182,x-68,-118),weight=.8)
        # Remove the original i dot, avoiding a double-mark collision.
        if base=='i':shapes.pop(3 if len(shapes)>3 else 2)
    build(char,w,accented)
build('¡',205,lambda:(path((102,-169),(102,356),weight=.9),dot(102,500,29)))
build('¿',426,lambda:(path((359,-34),(344,-218,49,-235,61,-27),(69,98,202,83,207,293),(207,363)),dot(207,511,28)))

# Fallback glyph and nonbreaking space.
pen=TTGlyphPen(None);pen.moveTo((50,0));pen.lineTo((50,700));pen.lineTo((450,700));pen.lineTo((450,0));pen.closePath()
glyphs['.notdef']=pen.glyph();widths['.notdef']=(500,0)
cmap[160]=cmap[32]
fb=FontBuilder(1000,isTTF=True)
fb.setupGlyphOrder(['.notdef']+[n for n in glyphs if n!='.notdef'])
fb.setupCharacterMap(cmap);fb.setupGlyf(glyphs);fb.setupHorizontalMetrics(widths)
fb.setupHorizontalHeader(ascent=960,descent=-280)
fb.setupNameTable({'familyName':'Ynera Bifurca','styleName':'Regular','uniqueFontIdentifier':'Ynera Bifurca Original 1.0','fullName':'Ynera Bifurca Regular','psName':'YneraBifurca-Regular','version':'Version 1.0','copyright':'Original drawings for Ynera, 2026. No third-party font outlines used.','description':'Original editorial display face. Bifurcated Y, organic contrast, high x-height. Designed for headings at 36px and larger.'})
fb.setupOS2(sTypoAscender=960,sTypoDescender=-280,sTypoLineGap=0,usWinAscent=960,usWinDescent=280,sxHeight=478,sCapHeight=700,usWeightClass=400,fsType=0)
fb.setupPost();fb.setupMaxp()
font=fb.font
kern=newTable('kern');kern.version=0
from fontTools.ttLib.tables._k_e_r_n import KernTable_format_0
sub=KernTable_format_0();sub.version=0;sub.coverage=1;sub.kernTable={}
for pair,val in {'AV':-65,'VA':-55,'WA':-45,'YA':-60,'Yo':-53,'Ye':-45,'Yn':-25,'To':-55,'Ta':-55,'Te':-55,'Ty':-45,'Tr':-35,'LT':-35,'LY':-45,'PA':-40,'FA':-40,'fi':-15,'fo':-16,'rv':-10,'ra':-12,'ro':-15,'ry':-18,'ve':-12,'vo':-12,'we':-12,'wo':-12,'yn':-8}.items():sub.kernTable[(cmap[ord(pair[0])],cmap[ord(pair[1])])]=val
kern.kernTables=[sub];font['kern']=kern
OUT.mkdir(exist_ok=True);font.save(OUT/'ynera-bifurca.ttf');font.flavor='woff2';font.save(OUT/'ynera-bifurca.woff2')
print('Created original font:',len(cmap),'characters;', (OUT/'ynera-bifurca.woff2').stat().st_size,'bytes')
