"""Ingest explicitly selected Commons candidates. Visual approval is a separate recorded step."""
import csv, hashlib, html, io, json, pathlib, re, sys, time, urllib.parse, urllib.request, shutil
from PIL import Image, ImageOps, ImageDraw
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'artifacts/v4/photo-research'; OUT.mkdir(parents=True,exist_ok=True)
DEST=ROOT/'assets/images/menu-v4';DEST.mkdir(parents=True,exist_ok=True)
SELECTIONS={
 '01':'Kopi O.jpg','03':'Kopi susu .jpg','05':'OldTownWhiteCofeeCup.jpg',
 '06':'Tea+Coffee Cham - Old Town Kopitiam Mamak AUD3.jpg',
 '07':'Cup of espresso 02.jpg','08':'Double espresso (2259728230).jpg','09':'Espresso Americano.jpeg',
 '10':'Classical Cappuccino in Savour Cafe.jpg','11':'Caffe Latte cup.jpg','12':'Flat white coffee with pretty feather pattern.jpg',
 '13':'Caffè macchiato.jpg','14':'Caffè Mocha by Phil.jpg',
 '15':'Fab Assembly Coffee piccolo at Over Under Coffee, Soho, London (27191548379).jpg',
 '16':'Iced americano.jpg','17':'Iced latte at 1933 Singapore, Capitol Piazza, Singapore - 20150902.jpg',
 '18':'Cold Brew Coffee (7994891379).jpg','20':'Espresso tonic.jpg',
 '21':"Iced Mocha - Granny's Café 2024-08-21.jpg",'22':'Rose coconut cold brew.jpg',
 '23':'Croissant-newspaper-and-tea.jpg','24':'Croissant Almond.jpg','25':'Pain au chocolat Luc Viatour.jpg',
 '26':'Pandan swiss roll.jpg','27':'Cinnamon rolls drizzled with glaze (1), April 2009.jpg','28':'Banana bread.jpg','29':'Basque-cheesecake.jpg','30':'Mango tart, 2015-06-06.jpg',
}
def get(url):
 return urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'KopiKitaConcept/4.0 (portfolio photo provenance)'}),timeout=60).read()
def clean(s):return html.unescape(re.sub('<[^>]+>','',s)).strip()
def main():
 selected=SELECTIONS.copy()
 extra=ROOT/'artifacts/v4/photo-research/additional-selections.json'
 if extra.exists():selected.update(json.loads(extra.read_text(encoding='utf-8')))
 cache=OUT/'selected-metadata.json'; meta=json.loads(cache.read_text(encoding='utf-8')) if cache.exists() else {}
 for cached in OUT.glob('*.json'):
  try:
   data=json.loads(cached.read_text(encoding='utf-8'))
   if isinstance(data,list):
    for page in data:
     if 'imageinfo' in page:meta[page['title'][5:]]=page
  except (ValueError,KeyError):pass
 missing=[f'File:{title}' for title in selected.values() if title not in meta]
 if missing:
  params=dict(action='query',format='json',titles='|'.join(missing),prop='imageinfo',iiprop='url|extmetadata')
  pages=json.loads(get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)))['query']['pages']
  for p in pages.values():
   if 'imageinfo' in p:meta[p['title'][5:]]=p
  cache.write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf-8')
 manifest=json.loads((ROOT/'data/product-photos.json').read_text(encoding='utf-8'))
 byid={p['id']:p for p in manifest}
 for id,title in selected.items():
  if title not in meta:print('MISSING FILE',id,title,flush=True);continue
  info=meta[title]['imageinfo'][0];ext=info['extmetadata'];license=clean(ext.get('LicenseShortName',{}).get('value',''))
  if not re.match(r'(CC BY|CC0|Public domain)',license):print('LICENSE REQUIRES REVIEW',id,title,license,flush=True);continue
  original=OUT/(id+'-'+hashlib.sha256(title.encode()).hexdigest()[:8]+pathlib.Path(urllib.parse.urlparse(info['url']).path).suffix)
  legacy=OUT/(id+'-original'+pathlib.Path(urllib.parse.urlparse(info['url']).path).suffix)
  if not original.exists() and legacy.exists() and byid.get(id,{}).get('title')==title:shutil.copyfile(legacy,original)
  try:
   if not original.exists():
    time.sleep(10)
    # Wikimedia requests standard cached thumbnail tiers instead of large originals.
    source=info['url'].split('?')[0];parts=source.split('/commons/')
    filename=parts[1].split('/')[-1]
    thumb=parts[0]+'/commons/thumb/'+parts[1]+'/960px-'+filename
    original.write_bytes(get(thumb))
   im=ImageOps.exif_transpose(Image.open(original)).convert('RGB');im.thumbnail((900,1000))
   path=f'assets/images/menu-v4/item-{id}.webp';im.save(ROOT/path,'WEBP',quality=84,method=6)
   small=im.copy();small.thumbnail((400,500));smallPath=f'assets/images/menu-v4/item-{id}-400.webp';small.save(ROOT/smallPath,'WEBP',quality=80,method=6)
   previous=byid.get(id,{}) if byid.get(id,{}).get('title')==title else {}
   byid[id]=dict(id=id,status=previous.get('status','candidate'),title=title,sourcePage=info['descriptionurl'],sourceUrl=info['url'].split('?')[0],creator=clean(ext.get('Artist',{}).get('value','')),license=license,licenseUrl=ext.get('LicenseUrl',{}).get('value',''),downloadDate='2026-10-20',path=path,smallPath=smallPath,width=im.width,height=im.height,downloadedSha256=hashlib.sha256(original.read_bytes()).hexdigest(),description=clean(ext.get('ImageDescription',{}).get('value','')),alt=previous.get('alt',title.rsplit('.',1)[0]),matchNotes=previous.get('matchNotes','Pending visual and ingredient match review'))
   print(id,title,license,byid[id]['creator'][:80],flush=True)
  except Exception as e:print('DOWNLOAD ERROR',id,str(e),flush=True)
 (ROOT/'data/product-photos.json').write_text(json.dumps(sorted(byid.values(),key=lambda p:p['id']),ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 sheet=Image.new('RGB',(1200,((len(byid)+3)//4)*270),'#f8ecd9');d=ImageDraw.Draw(sheet)
 for n,p in enumerate(sorted(byid.values(),key=lambda p:p['id'])):
  im=Image.open(ROOT/p['path']);im=ImageOps.contain(im,(282,220));x=(n%4)*300;y=(n//4)*270;sheet.paste(im,(x+(300-im.width)//2,y));d.text((x+8,y+225),p['id']+' '+p['title'][:35],fill='#0b231d')
 sheet.save(OUT/'candidates.jpg',quality=90)
if __name__=='__main__':main()
