"""Rebuild translation bindings from the two static, independently readable pages."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
import json,re
root=Path(__file__).resolve().parents[1]
void=set('area base br col embed hr img input link meta param source track wbr'.split())
class Nodes(HTMLParser):
 def __init__(self,source):
  super().__init__(convert_charrefs=True);self.source=source;self.lines=[0]
  for m in re.finditer('\n',source):self.lines.append(m.end())
  self.stack=[{'path':'','counts':{},'skip':False}];self.nodes={};self.feed(source)
 def handle_starttag(self,tag,attrs):
  parent=self.stack[-1];counts=parent['counts'];counts[tag]=counts.get(tag,0)+1
  path=parent['path']+'/'+tag+str(counts[tag]);a=dict(attrs)
  line,col=self.getpos();offset=self.lines[line-1]+col
  node={'path':path,'counts':{},'skip':parent['skip'] or tag in ('script','style') or 'language-switch' in a.get('class',''),'attrs':a,'text':[],'offset':offset,'tag':tag,'raw':self.get_starttag_text()}
  self.nodes[path]=node
  if tag not in void:self.stack.append(node)
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in void:self.handle_endtag(tag)
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,0,-1):
   if self.stack[i]['tag']==tag:self.stack=self.stack[:i];break
 def handle_data(self,data):
  if data.strip() and not self.stack[-1]['skip']:self.stack[-1].setdefault('text',[]).append(data)
pages={lang:re.sub(r' data-copy="[^"]*"','',(root/name).read_text()) for lang,name in [('es','index.html'),('en','en.html')]}
parsed={lang:Nodes(s) for lang,s in pages.items()};bindings={};insertions={'es':[],'en':[]}
for path,left in parsed['es'].nodes.items():
 right=parsed['en'].nodes.get(path)
 if not right or left['skip'] or right['skip']:continue
 attrs=[key for key in ['aria-label','alt','title','data-plate','content'] if key in left['attrs'] and key in right['attrs'] and left['attrs'][key]!=right['attrs'][key]]
 texts=left['text']!=right['text']
 if not attrs and not texts:continue
 assert len(left['text'])==len(right['text']),(path,left['text'],right['text'])
 key=str(len(bindings));bindings[key]={}
 for lang,node in [('es',left),('en',right)]:
  bindings[key][lang]={'text':node['text'] if texts else None,'attrs':{a:node['attrs'][a] for a in attrs}}
  raw=node['raw'];at=node['offset']+len(raw)-1
  if raw.endswith('/>'):at-=1
  insertions[lang].append((at,' data-copy="'+key+'"'))
schemas={lang:json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>',s,re.S)[1]) for lang,s in pages.items()}
for lang,name in [('es','index.html'),('en','en.html')]:
 s=pages[lang]
 for at,value in sorted(insertions[lang],reverse=True):s=s[:at]+value+s[at:]
 (root/name).write_text(s)
(root/'language-data.js').write_text('window.YneraTranslations='+json.dumps({'bindings':bindings,'schemas':schemas},ensure_ascii=False,separators=(',',':'))+';\n')
print('Built',len(bindings),'translation bindings')
