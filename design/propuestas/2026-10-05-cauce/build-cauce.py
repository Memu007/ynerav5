"""Ynera Cauce: unapproved independent headline proposal, derived from Ynera Sistema.
Editable source: lowercase outlines and optical stroke model are defined below.
Requires Python 3.12+, fonttools and brotli. Rebuild: python3 build-cauce.py
Optionally set YNERA_FONTTOOLS_PATH for dependencies installed in a custom directory.
"""
import math, os, pathlib, sys, unicodedata
if os.environ.get("YNERA_FONTTOOLS_PATH"):
    sys.path.insert(0, os.environ["YNERA_FONTTOOLS_PATH"])
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import newTable

OUT=pathlib.Path(__file__).resolve().parent/'fonts'
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
        # Optical stroke: slightly stronger verticals, flat cut terminals.
        # Optical weight is tuned for headings, not body text.
        rx=weight*42; ry=weight*34
        a.append((x+nx*rx,y+ny*ry));b.append((x-nx*rx,y-ny*ry))
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

def dot(x,y,r=28):
    polygon([(x+math.cos(i*math.tau/24)*r,y+math.sin(i*math.tau/24)*r) for i in range(24)])

def oval(x0,y0,x1,y1):
    cx=(x0+x1)/2;cy=(y0+y1)/2; rx=(x1-x0)/2;ry=(y1-y0)/2;k=.82
    path((cx,y1),(cx+k*rx,y1,x1,cy+k*ry,x1,cy),(x1,cy-k*ry,cx+k*rx,y0,cx,y0),(cx-k*rx,y0,x0,cy-k*ry,x0,cy),(x0,cy+k*ry,cx-k*rx,y1,cx,y1))

def bowl(x,y0,y1,w):
    m=(y0+y1)/2
    path((x,y1),(x+w*.88,y1,x+w,y1-14,x+w,m),(x+w,y0+14,x+w*.88,y0,x,y0))

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
    if c=='A':path((55,0),(265,700),(305,700),(515,0));path((130,240),(440,240))
    elif c=='B':stem(80,0,700);bowl(80,350,700,340);bowl(80,0,350,360)
    elif c=='C':path((505,600),(505,690,470,700,305,700),(85,700,65,678,65,350),(65,22,85,0,305,0),(470,0,505,10,505,100))
    elif c=='D':stem(80,0,700);bowl(80,0,700,430)
    elif c=='E':path((470,700),(80,700),(80,0),(480,0));path((80,350),(415,350))
    elif c=='F':path((470,700),(80,700),(80,0));path((80,350),(415,350))
    elif c=='G':path((505,600),(505,690,470,700,305,700),(85,700,65,678,65,350),(65,22,85,0,305,0),(470,0,505,10,505,100),(505,320),(350,320))
    elif c=='H':stem(80,0,700);stem(500,0,700);path((80,350),(500,350))
    elif c=='I':stem(106,0,700)
    elif c=='J':path((325,700),(325,157),(325,20,308,0,192,0),(78,0,66,25,66,125))
    elif c=='K':stem(80,0,700);path((490,700),(80,272));path((275,474),(505,0))
    elif c=='L':path((80,700),(80,0),(480,0))
    elif c=='M':path((80,0),(80,700),(120,700),(335,210),(550,700),(590,700),(590,0))
    elif c=='N':path((80,0),(80,700),(120,700),(500,0),(500,700))
    elif c=='O':oval(65,0,535,700)
    elif c=='P':stem(80,0,700);bowl(80,330,700,360)
    elif c=='Q':oval(65,0,535,700);path((365,150),(575,-80))
    elif c=='R':stem(80,0,700);bowl(80,330,700,360);path((250,330),(510,0))
    elif c=='S':path((470,620),(440,700,90,763,80,534),(70,335,467,419,475,187),(483,-45,145,-40,65,80))
    elif c=='T':path((45,700),(505,700));stem(275,0,700)
    elif c=='U':path((80,700),(80,200),(80,20,102,0,295,0),(488,0,510,20,510,200),(510,700))
    elif c=='V':path((48,700),(255,0),(295,0),(508,700))
    elif c=='W':path((48,700),(198,0),(238,0),(385,550),(532,0),(572,0),(725,700))
    elif c=='X':path((62,700),(498,0));path((490,700),(69,0))
    elif c=='Y':path((45,700),(284,351),(533,700));stem(284,0,351)
    elif c=='Z':path((65,700),(490,700),(65,0),(498,0))

capwidth={'A':560,'B':520,'C':566,'D':581,'E':532,'F':510,'G':565,'H':590,'I':213,'J':390,'K':570,'L':530,'M':677,'N':591,'O':605,'P':514,'Q':629,'R':570,'S':528,'T':552,'U':592,'V':557,'W':777,'X':559,'Y':579,'Z':560}
for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':build(c,capwidth[c],lambda c=c:cap(c))

def lower(c):
    # Cauce: large x-height, restrained broadness, flat ends, optical contrast.
    if c=='a':
        path((85,459),(135,504,206,539,290,530),(380,529,416,487,416,402),(416,27),(458,27))
        path((414,285),(346,299,291,301,233,293),(134,281,76,238,76,150),(76,57,130,0,231,0),(320,0,384,45,416,103))
    elif c=='b':
        stem(82,0,720)
        path((82,405),(127,492,182,534,276,530),(402,529,453,437,453,270),(453,99,400,0,277,0),(183,0,122,31,82,69))
    elif c=='c':path((418,444),(399,514,359,530,256,530),(105,530,76,477,76,265),(76,53,108,0,256,0),(340,0,389,27,422,84))
    elif c=='d':
        path((431,462),(388,502,331,530,260,530),(136,530,77,432,77,267),(77,99,132,0,255,0),(341,0,394,43,431,107))
        stem(431,0,720)
    elif c=='e':
        path((79,272),(429,283),(432,491,397,530,263,530),(111,530,76,475,76,269),(76,57,113,0,278,0),(344,0,395,23,439,68))
    elif c=='f':path((131,0),(131,538),(131,663,178,720,274,720),(306,720,331,713,355,703));path((44,518),(325,518))
    elif c=='g':
        path((426,463),(382,504,329,530,256,530),(135,530,76,432,76,268),(76,102,132,0,254,0),(338,0,394,42,426,101))
        path((426,530),(426,-52),(426,-165,364,-210,258,-210),(187,-210,130,-193,85,-173))
    elif c=='h':stem(82,0,720);path((82,380),(131,485,190,530,278,530),(379,530,424,468,424,358),(424,0))
    elif c=='i':stem(99,0,530);polygon([(62,652),(136,652),(136,726),(62,726)])
    elif c=='j':path((141,530),(141,-78),(141,-173,108,-210,29,-210));polygon([(104,652),(178,652),(178,726),(104,726)])
    elif c=='k':stem(82,0,720);path((434,530),(82,195));path((248,352),(447,0))
    elif c=='l':stem(99,0,720)
    elif c=='m':stem(82,0,530);path((82,380),(125,484,176,530,247,530),(337,530,375,468,375,352),(375,0));path((375,380),(418,484,469,530,540,530),(630,530,668,468,668,352),(668,0))
    elif c=='n':stem(82,0,530);path((82,380),(131,485,190,530,278,530),(379,530,424,468,424,358),(424,0))
    elif c=='o':oval(76,0,450,530)
    elif c=='p':
        stem(82,-210,530)
        path((82,404),(127,492,182,534,276,530),(402,529,453,437,453,270),(453,99,400,0,277,0),(183,0,122,31,82,69))
    elif c=='q':
        path((431,462),(388,502,331,530,260,530),(136,530,77,432,77,267),(77,99,132,0,255,0),(341,0,394,43,431,107));stem(431,-210,530)
    elif c=='r':stem(82,0,530);path((82,368),(126,490,204,546,330,523))
    elif c=='s':path((388,457),(339,514,272,532,212,530),(126,528,77,482,77,414),(77,251,391,318,391,143),(391,56,327,0,230,0),(165,0,111,17,65,60))
    elif c=='t':path((148,682),(148,134),(148,39,188,0,263,0),(299,0,327,8,351,20));path((50,518),(343,518))
    elif c=='u':path((82,530),(82,174),(82,59,127,0,228,0),(316,0,375,45,424,150));stem(424,0,530)
    elif c=='v':path((45,530),(246,0),(272,0),(475,530))
    elif c=='w':path((45,530),(172,0),(198,0),(361,442),(525,0),(551,0),(679,530))
    elif c=='x':path((63,530),(442,0));path((437,530),(68,0))
    elif c=='y':path((49,530),(253,0));path((479,530),(274,17),(209,-146,173,-210,77,-210))
    elif c=='z':path((69,530),(420,530),(69,0),(431,0))

lw={'a':532,'b':535,'c':496,'d':527,'e':520,'f':390,'g':521,'h':521,'i':210,'j':242,'k':520,'l':210,'m':764,'n':521,'o':528,'p':535,'q':527,'r':399,'s':465,'t':404,'u':521,'v':522,'w':725,'x':514,'y':526,'z':509}
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
    baseglyph=glyphs[cmap[ord(base)]]; w=widths[cmap[ord(base)]][0]; top=700 if base.isupper() else 540
    def accented(baseglyph=baseglyph,w=w,top=top,mark=mark,base=base):
        global shapes
        shapes=[p[:] for p in baseglyph._shapes]
        if base=="i":shapes=shapes[:1]
        x=w/2
        if mark=='\u0301':path((x-35,top+80),(x+53,top+200),weight=.95)
        elif mark=='\u0300':path((x+35,top+80),(x-53,top+200),weight=.95)
        elif mark=='\u0308':dot(x-70,top+132,22);dot(x+70,top+132,22)
        elif mark=='\u0303':path((x-104,top+95),(x-56,top+199,x+32,top+58,x+103,top+154),weight=.95)
        elif mark=='\u0302':path((x-90,top+90),(x,top+187),(x+90,top+90),weight=.95)
        elif mark=='\u0327':path((x+20,-6),(x-5,-80),(x+95,-162,x-58,-182,x-68,-118),weight=.8)
        # Remove the original i dot, avoiding a double-mark collision.
        # Dot already removed above for accented i.
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
fb.setupNameTable({'familyName':'Ynera Cauce','styleName':'Regular','uniqueFontIdentifier':'Ynera Cauce Proposal 0.1','fullName':'Ynera Cauce Regular','psName':'YneraCauce-Regular','version':'Version 0.1','copyright':'Original drawings for Ynera, 2026. No third-party font outlines used.','description':'Independent proposal derived from original Ynera Sistema source. Larger lowercase, optically contrasted strokes, opened proportions, redrawn lowercase. Display only at 36px and larger; proof required beyond Spanish and English.'})
fb.setupOS2(sTypoAscender=960,sTypoDescender=-280,sTypoLineGap=0,usWinAscent=960,usWinDescent=280,sxHeight=530,sCapHeight=700,usWeightClass=400,fsType=0)
fb.setupPost();fb.setupMaxp()
font=fb.font
for name in font.getGlyphOrder():
    glyph=font["glyf"][name]
    glyph.recalcBounds(font["glyf"])
    advance,_=font["hmtx"][name]
    font["hmtx"][name]=(advance,getattr(glyph,"xMin",0))
kern=newTable('kern');kern.version=0
from fontTools.ttLib.tables._k_e_r_n import KernTable_format_0
sub=KernTable_format_0();sub.version=0;sub.coverage=1;sub.kernTable={}
for pair,val in {'AV':-65,'VA':-55,'WA':-45,'YA':-60,'Yo':-53,'Ye':-45,'Yn':-25,'To':-55,'Ta':-55,'Te':-55,'Ty':-45,'Tr':-35,'LT':-35,'LY':-45,'PA':-40,'FA':-40,'fi':-15,'fo':-16,'rv':-10,'ra':-12,'ro':-15,'ry':-18,'ve':-12,'vo':-12,'we':-12,'wo':-12,'yn':-8}.items():sub.kernTable[(cmap[ord(pair[0])],cmap[ord(pair[1])])]=val
kern.kernTables=[sub];font['kern']=kern
OUT.mkdir(exist_ok=True);font.save(OUT/'ynera-cauce.ttf');font.flavor='woff2';font.save(OUT/'ynera-cauce.woff2')
print('Created original font:',len(cmap),'characters;', (OUT/'ynera-cauce.woff2').stat().st_size,'bytes')
