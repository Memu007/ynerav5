from pathlib import Path
import os,sys,re,base64,json,html
if os.environ.get("YNERA_FONTTOOLS_PATH"):
    sys.path.insert(0,os.environ["YNERA_FONTTOOLS_PATH"])
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
OUT=Path(__file__).parent
ROOT=Path(os.environ.get("YNERA_SITE_PATH",str(OUT.parents[1])))
font=TTFont(OUT/'fonts/ynera-cauce.ttf'); cm=font.getBestCmap(); gs=font.getGlyphSet(); kern=font['kern'].kernTables[0].kernTable
phrases={'es':['Tu operación,','bajo control.'],'en':['Your business,','under control.']}
logo=re.search(r'<svg class="brand-wordmark".*?</svg>',(ROOT/'index.html').read_text()).group()
logo=re.sub('class="brand-wordmark"','width="148" height="36"',logo)
woff=base64.b64encode((OUT/'fonts/ynera-cauce.woff2').read_bytes()).decode()
bodyfont=base64.b64encode((ROOT/'fonts/instrument-sans.ttf').read_bytes()).decode()
intro={'es':'Menos hojas de cálculo.<br>Menos riesgo.','en':'Fewer spreadsheets.<br>Less risk.'}
body={'es':'Empezamos por un proceso que hoy depende de hojas de cálculo, carga duplicada o tareas manuales.','en':'We start with one process that relies on spreadsheets, duplicate data entry or manual tasks.'}
def panel(lang,width):
    lines=phrases[lang]; size=80 if width==1124 else 44 if width==390 else 36
    label=f'{lang.upper()} · {width} px · {size} px'
    return f'<section class="frame w{width}" lang="{lang}"><div class="tag">{label}</div><header>{logo}<small>ES &nbsp; EN</small></header><div class="content"><div class="audience">{"PARA PEQUEÑAS Y MEDIANAS EMPRESAS" if lang=="es" else "FOR SMALL AND MEDIUM BUSINESSES"}</div><p class="intro">{intro[lang]}</p><h1><span>{lines[0]}</span><span>{lines[1]}</span></h1><p class="body">{body[lang]}</p><button>{"Agenda una consulta sin costo" if lang=="es" else "Book a free consultation"}</button></div></section>'
css=f'''@font-face{{font-family:Cauce;src:url(data:font/woff2;base64,{woff}) format('woff2');font-weight:400}}@font-face{{font-family:Instrument;src:url(data:font/ttf;base64,{bodyfont}) format('truetype');font-weight:400 700}}*{{box-sizing:border-box}}body{{margin:0;padding:40px;background:#e9e8e1;color:#51406a;font-family:Instrument,Arial,sans-serif}}.sheet-title{{font-size:28px;margin:0 0 8px}}.note{{max-width:760px;font-size:15px;line-height:1.5;margin:0 0 32px}}.frame{{background:radial-gradient(ellipse at 100% 0%,#34454b 0%,#201d29 52%,#17131f 100%);color:#eeeaf2;position:relative;flex:none;margin-bottom:24px;overflow:hidden}}.tag{{padding:9px 20px;background:#51406a;color:#fff;font-size:12px;letter-spacing:.05em}}header{{display:flex;justify-content:space-between;align-items:center;padding:24px 40px}}header small{{font-size:11px}}.content{{padding:32px 40px 52px}}.audience{{font-size:11px;letter-spacing:.055em;line-height:1.5;color:#c6c2cb}}.intro{{font-size:24px;line-height:1.3;margin:22px 0 22px;color:#c6c2cb}}h1{{font-family:Cauce;font-weight:400;font-size:80px;line-height:1.06;letter-spacing:0;margin:0 0 28px;font-synthesis:none}}h1 span{{display:block;white-space:nowrap}}.body{{font-size:17px;line-height:1.6;color:#c6c2cb;max-width:530px;margin:0 0 24px}}button{{font:500 14px Instrument;background:#eeeaf2;color:#17131f;border:0;padding:16px 20px}}.w1124{{width:1124px}}.mobiles{{display:flex;gap:24px;align-items:flex-start}}.w390{{width:390px}}.w320{{width:320px}}.w390 header,.w320 header{{padding:20px 18px}}.w390 .content,.w320 .content{{padding:28px 18px 36px}}.w390 .intro,.w320 .intro{{font-size:20px;margin:20px 0 24px}}.w390 h1{{font-size:44px;line-height:1.1}}.w320 h1{{font-size:36px;line-height:1.1}}.w390 .body,.w320 .body{{font-size:16px;line-height:1.55}}.w320 header svg{{width:126px}}.glyphs{{font:400 70px/1.25 Cauce;max-width:1124px;word-wrap:break-word}}.sizes{{font-family:Cauce}}'''
markup=f'<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ynera Cauce — propuesta Astra</title><style>{css}</style><h2 class="sheet-title">Ynera Cauce · propuesta de titulares</h2><p class="note">Una única dirección: minúsculas más presentes, curvas tensas y terminales rectos. Fuente real derivada de Sistema; el logotipo aprobado se conserva. Prueba aislada de tipografía, pendiente de aprobación.</p>'+panel('es',1124)+panel('en',1124)+'<div class="mobiles">'+panel('es',390)+panel('en',390)+'</div><div class="mobiles">'+panel('es',320)+panel('en',320)+'</div><p class="glyphs" contenteditable="true">a e r t u y<br>Datos. Seguridad. Inteligencia.<br>ÁÉÍÓÚ áéíóú ñ ü ¿? 0123456789</p><p class="note">Texto inferior editable para probar otros titulares. Ninguna pieza se ha aplicado al sitio.</p></html>'
(OUT/'specimen.html').write_text(markup)
# Actual font outline SVG: no dependency on installed fonts, preserves exact glyph contours.
def drawn(text,x,y,size,color='#eeeaf2'):
    pos=0;parts=[];prev=None
    for c in text:
        name=cm[ord(c)];pos+=kern.get((prev,name),0)
        pen=SVGPathPen(gs);gs[name].draw(pen)
        parts.append(f'<path transform="translate({pos} 0)" d="{pen.getCommands()}"/>')
        pos+=font['hmtx'][name][0];prev=name
    return f'<g fill="{color}" transform="translate({x} {y}) scale({size/1000} {-size/1000})">'+''.join(parts)+'</g>',pos*size/1000
svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1420" height="1300" viewBox="0 0 1420 1300"><rect width="1420" height="1300" fill="#e9e8e1"/><style>text{font-family:Arial,sans-serif;fill:#51406a}</style><text x="40" y="48" font-size="25">Ynera Cauce · propuesta Astra</text><text x="40" y="77" font-size="14">Fuente real · logo aprobado intacto · pendiente de aprobación</text>']
measure={}
for lang,x in [('es',40),('en',740)]:
    svg.append(f'<rect x="{x}" y="112" width="640" height="350" fill="#17131f"/><text x="{x+28}" y="142" style="fill:#c6c2cb" font-size="12">{lang.upper()} · área de texto desktop · 80 px</text>')
    for i,line in enumerate(phrases[lang]):
        path,width=drawn(line,x+28,270+i*86,80);svg.append(path);measure[f'{lang}-desktop-{i}']=round(width,2)
for lang,x,width in [('es',40,390),('en',456,390),('es',40,320),('en',386,320)]:
    size=44 if width==390 else 36;y=505 if width==390 else 840
    svg.append(f'<rect x="{x}" y="{y}" width="{width}" height="270" fill="#17131f"/><text x="{x+18}" y="{y+31}" style="fill:#c6c2cb" font-size="12">{lang.upper()} · {width} px · título {size} px</text>')
    for i,line in enumerate(phrases[lang]):
        path,m=drawn(line,x+18,y+126+i*size*1.1,size);svg.append(path);measure[f'{lang}-{width}-{i}']=round(m,2)
        assert m<=width-36,(lang,width,m)
svg.append('<text x="925" y="544" font-size="16">Cambios de dibujo</text>')
for i,(chars,desc) in enumerate([('a e','Contraformas y aperturas más claras'),('r t','Hombro abierto y pie asimétrico'),('u y','Uniones fluidas; remates rectos')]):
    svg.append(drawn(chars,925,640+i*158,87,'#51406a')[0]);svg.append(f'<text x="925" y="{681+i*158}" font-size="13">{desc}</text>')
svg.append('<text x="40" y="1170" font-size="15">Caja baja 530 / mayúscula 700 · cuerpo Instrument Sans · violeta #51406A sobre papel</text><text x="40" y="1201" font-size="14">Uso propuesto: titulares desde 36 px. Revisar kerning de palabras adicionales antes de publicación.</text></svg>')
(OUT/'specimen.svg').write_text(''.join(svg))
required='Tu operación, bajo control. Your business, under control. ÁÉÍÓÚáéíóúñü¿?0123456789'
assert all(ord(c) in cm for c in required)
assert font['OS/2'].sxHeight==530
web=TTFont(OUT/'fonts/ynera-cauce.woff2');assert web.getBestCmap()==cm
for n in font.getGlyphOrder():
    g=font['glyf'][n]
    assert font['hmtx'][n][1]==getattr(g,'xMin',0)
(OUT/'verification.json').write_text(json.dumps({'glyph_coverage':len(cm),'x_height':530,'cap_height':700,'measurements_px':measure,'woff2_roundtrip':'pass','hero_characters':'pass','mobile_widths':'pass','left_bearings':'pass'},indent=2))
print(json.dumps(measure,indent=2))
comparison=['<svg xmlns="http://www.w3.org/2000/svg" width="1124" height="675" viewBox="0 0 1124 675"><rect width="1124" height="675" fill="#17131f"/><g fill="#c6c2cb" font-family="Arial,sans-serif" font-size="15"><text x="40" y="40">Comparación a 80 px · mismo fondo, interlineado y espaciado · sin escalar horizontalmente</text><text x="40" y="88">Sistema actual</text><text x="40" y="368">Cauce propuesta · pendiente de aprobación</text></g><path d="M40 321H1084" stroke="#51406a"/></svg>']
comparison=comparison[0][:-6]
for label,source,baseline in [('Sistema',ROOT/'fonts/ynera-sistema.ttf',178),('Cauce',OUT/'fonts/ynera-cauce.ttf',458)]:
    font=TTFont(source);cm=font.getBestCmap();gs=font.getGlyphSet();kern=font['kern'].kernTables[0].kernTable
    for i,line in enumerate(phrases['es']):comparison+=drawn(line,40,baseline+i*86,80)[0]
    comparison+=drawn('a e r t',735,baseline+60,80)[0]
comparison+='<text x="40" y="623" fill="#c6c2cb" font-family="Arial,sans-serif" font-size="14">Cambio comprobable: mayor caja baja y nuevas formas. La memorabilidad requiere juicio de marca.</text></svg>'
(OUT/'comparison.svg').write_text(comparison)
