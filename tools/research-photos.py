"""Cache Commons discovery metadata. Discovery is not approval or a photo gate pass."""
import concurrent.futures, json, urllib.request, urllib.parse, pathlib, re, time
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT/'artifacts/v4/photo-research'
OUT.mkdir(parents=True,exist_ok=True)
queries = ['intitle:"flat white"','intitle:macchiato','intitle:mocha','intitle:piccolo coffee','intitle:"iced americano"','intitle:"iced latte"','intitle:"cold brew"','intitle:"gula melaka" coffee','intitle:"iced mocha"','intitle:croissant','intitle:"almond croissant"','intitle:"pain au chocolat"','intitle:"cinnamon roll"','intitle:"banana bread"','intitle:"basque cheesecake"','intitle:"mango tart"']
def request(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'KopiKitaConcept/4.0 (educational portfolio; provenance research)'}),timeout=45).read()
def run(q):
 path=OUT/(re.sub(r'[^a-z0-9]+','-',q.lower()).strip('-')+'.json')
 if path.exists(): return q,json.loads(path.read_text(encoding='utf-8'))
 params=dict(action='query',format='json',generator='search',gsrsearch=q,gsrnamespace=6,gsrlimit=6,prop='imageinfo',iiprop='url|extmetadata',iiurlwidth=1000)
 try:
  time.sleep(3)
  data=json.loads(request('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))
  pages=list(data.get('query',{}).get('pages',{}).values())
  path.write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
  return q,pages
 except Exception as e:return q,[{'title':'ERROR '+str(e)}]
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
  for q,pages in pool.map(run,queries):
   print(q,':', ' | '.join(p['title'] for p in pages),flush=True)
