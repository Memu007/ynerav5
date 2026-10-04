"""Run: python3 design/verify.py — local bilingual content checks."""
import json, re
from pathlib import Path
from html import unescape
from html.parser import HTMLParser
root = Path(__file__).resolve().parents[1]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.ids = []; self.refs = []; self.lang = None; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if 'id' in a: self.ids.append(a['id'])
        for k in ('href', 'src'):
            if k in a: self.refs.append(a[k])
for name, lang, other in [('index.html', 'es', 'en.html'), ('en.html', 'en', 'index.html')]:
    text = (root/name).read_text(); page = Page(text)
    assert page.lang == lang, (name, page.lang)
    assert len(page.ids) == len(set(page.ids)), name + ': duplicate IDs'
    assert other in page.refs, name + ': missing language switch'
    assert '5491100000000' not in text and 'wa.me/' not in text, name + ': fictitious contact'
    assert text.count('class="product-space"') == 2, name + ': screenshot spaces'
    assert 'data-area=' not in text, name + ': unconfirmed quiz selections'
    for ref in page.refs:
        if ref.startswith('#'): assert ref[1:] in page.ids, (name, ref)
        elif not re.match(r'[a-z]+:', ref): assert (root/ref.split('?')[0].split('#')[0]).exists(), (name, ref)
    structured = json.loads(re.search(r'<script type="application/ld\+json">(.*?)</script>', text, re.S)[1])
    faq = next(n for n in structured['@graph'] if n['@type'] == 'FAQPage')
    clean = lambda x: unescape(re.sub('<[^>]*>', '', x)).replace('\xa0', ' ')
    faq_section = re.search(r'<section[^>]*id="faq".*?</section>', text, re.S)[0]
    visible = [(clean(q), clean(a)) for q,a in re.findall(r'<details[^>]*><summary[^>]*>(.*?)</summary><p[^>]*>(.*?)</p></details>', faq_section, re.S)]
    assert len(visible) == 5, name + ': five buying questions'
    assert 'id="diagnostico"' not in text and '#diagnostico' not in page.refs, name + ': removed diagnostic'
    assert "getElementById('sp-'" not in text, name + ': removed tree update'
    assert text.count('<canvas id="tree"') == 1, name + ': main tree preserved'
    story = re.search(r'<section[^>]*id="story".*?</section>', text, re.S)[0]
    assert story.count('class="story-commitment"') == 3, name + ': three commitments in existing tree chapters'
    process = re.search(r'<section[^>]*id="proceso".*?</section>', text, re.S)[0]
    assert process.count('class="step"') == 4 and 'pledges' not in process, name + ': process ends at fourth stage'
    assert visible == [(q['name'], q['acceptedAnswer']['text']) for q in faq['mainEntity']], name + ': FAQ mismatch'
    print(name + ': language, local links, contact, spaces and FAQ OK')
