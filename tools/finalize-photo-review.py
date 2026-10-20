"""Apply the recorded visual review decisions; never promote a near-match."""
import csv,html,json,pathlib,shutil
from PIL import Image,ImageOps,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[1]
reasons={}
alts={
 '01':'Black kopi in a traditional patterned ceramic cup and saucer',
 '02':'Black Malaysian coffee in a floral cup at Georgetown, Penang',
 '03':'Milk coffee in a small patterned enamel cup with a spoon',
 '04':'A foamy cup of Malaysian kopitiam coffee at Yinzo Kopi in Ipoh',
 '05':'Creamy Malaysian white coffee in an OldTown cup and saucer',
 '06':'Kopi cham, the coffee and tea blend, in a patterned ceramic cup',
 '07':'A short espresso with crema in a small cup on a saucer',
 '08':'A double espresso in a white ceramic cup',
 '09':'Hot black Americano in a tall glass mug',
 '10':'Cappuccino topped with milk foam and a sweep of cocoa',
 '11':'Caffè latte with a heart of textured milk in a ceramic cup',
 '12':'Flat white with a feather pattern in fine milk foam',
 '13':'Espresso macchiato in a small glass with milk foam on top',
 '14':'Mocha with layered milk, coffee and cocoa in a glass mug',
 '15':'Piccolo coffee with textured milk in a little glass on a yellow saucer',
 '16':'Black iced Americano with ice cubes, photographed from above',
 '17':'Iced latte in a tall glass with milk foam and a straw',
 '18':'A glass of dark cold-brew coffee beside a softly lit window',
 '19':'Two glasses of iced palm-sugar coffee layered with milk and ice',
 '20':'Orange espresso poured over ice and tonic with a fresh orange peel',
 '21':'Iced mocha with ice cubes and cocoa in a fluted glass',
 '22':'Iced coffee with coconut milk and ice in a clear glass',
 '23':'Golden butter croissant on a white plate beside a newspaper and cup',
 '24':'Almond croissant covered in sliced almonds on a dark plate',
 '25':'Golden pain au chocolat with chocolate visible in its laminated layers',
 '26':'Slices of pandan sponge roll with a light spiral filling',
 '27':'Cinnamon rolls being drizzled with a light white glaze',
 '28':'A slice of banana bread with a caramelised outer edge',
 '29':'A homemade Basque cheesecake with a deeply browned top in baking paper',
 '30':'Fresh mango slices arranged over a pastry tart',
}
matchNotes={
 '02':'Wikimedia Commons identifies the photograph as coffee in Malaysia; its description records Georgetown, Penang, in 2013. The image visibly shows dark coffee in a floral cup. It is a representative black-kopi image; no claim is made about sugar. Cropped, resized and converted to WebP under CC BY 2.0 with title, creator, source and license credit. Independent illustrative photography, not a KopiKita product shoot.',
 '04':'The source identifies a photographed cup of coffee at Yinzo Kopi in Ipoh, Malaysia. The crop centers the local kopitiam coffee and removes most of the accompanying toast. The image does not establish the precise milk ingredient. Independently sourced illustrative photography, not a KopiKita product shoot. Cropped and adapted under CC BY 2.0 with attribution.',
 '26':'The source identifies a pandan Swiss roll; the image visibly shows green pandan sponge and a pale spiral filling. It is used as a representative visual for the pandan roll, without claiming that the photographed filling is kaya or that KopiKita prepared it. Cropped and converted under CC BY-SA 4.0; the derivative remains under the same license.',
 '30':'The Pexels caption identifies a mango tart, and the photograph visibly shows fresh mango pieces on a pastry base. The image does not establish a particular cream recipe. Independently sourced illustrative photography, not a KopiKita product shoot. Pexels marks the image free to use; credit is included.',
 '19':'Creator caption identifies coffee with palm sugar and ice; visual inspection shows iced coffee layered with milk. This matches the menu description of palm sugar, espresso and milk. Independent photograph, not a KopiKita product shoot. Unsplash marks it free for commercial use; credited here.',
 '20':'Creator caption explicitly identifies an iced orange espresso tonic; visual inspection confirms orange peel, espresso pour, ice and tonic. The crop removes the source glass branding while retaining the drink. Independent photograph, not a KopiKita product shoot. Unsplash marks it free for commercial use; credited here.',
 '22':'Creator caption identifies “Coconut & brew”; Unsplash tags identify coconut, iced coffee, cold brew and nut milk. Visual inspection shows iced coffee layered with pale milk. This matches the menu description. Independent photograph, not a KopiKita product shoot. Unsplash marks it free for commercial use; credited here.',
}
sourceOverrides={
 '02':{'title':'Coffee (9634387111).jpg','sourcePage':'https://commons.wikimedia.org/wiki/File:Coffee_(9634387111).jpg','sourceUrl':'https://upload.wikimedia.org/wikipedia/commons/0/07/Coffee_%289634387111%29.jpg','creator':'LeonardKong','license':'CC BY 2.0','licenseUrl':'https://creativecommons.org/licenses/by/2.0','downloadDate':'2026-10-20','description':'Georgetown @ Penang 2013','path':'assets/images/menu-v4/item-02.webp','smallPath':'assets/images/menu-v4/item-02-400.webp','downloadedSha256':'5e5b7518361a85efe40bb28fca583ce09e816cc6849a4ec9202e33480fa92390'},
 '04':{'title':'Kaya toast, Yinzo Kopi, Ipoh, Malaysia with cup of coffee.jpg','sourcePage':'https://commons.wikimedia.org/wiki/File:Kaya_toast,_Yinzo_Kopi,_Ipoh,_Malaysia_with_cup_of_coffee.jpg','sourceUrl':'https://upload.wikimedia.org/wikipedia/commons/2/24/Kaya_toast%2C_Yinzo_Kopi%2C_Ipoh%2C_Malaysia_with_cup_of_coffee.jpg','creator':'Sharon Hahn Darlin','license':'CC BY 2.0','licenseUrl':'https://creativecommons.org/licenses/by/2.0','downloadDate':'2026-10-20','description':'Kaya toast and a cup of coffee at Yinzo Kopi in Ipoh, Malaysia','path':'assets/images/menu-v4/item-04.webp','smallPath':'assets/images/menu-v4/item-04-400.webp','downloadedSha256':'1d02c96890391a3939ae18f21cfce528d36823e78e42f7a3c107bc9c305557c2'},
 '26':{'title':'Pandan swiss roll.jpg','sourcePage':'https://commons.wikimedia.org/wiki/File:Pandan_swiss_roll.jpg','sourceUrl':'https://upload.wikimedia.org/wikipedia/commons/f/f6/Pandan_swiss_roll.jpg','creator':'Peachyeung316','license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','downloadDate':'2026-10-20','description':'Pandan swiss roll from local moment of happiness bakery in yuen long','path':'assets/images/menu-v4/item-26.webp','smallPath':'assets/images/menu-v4/item-26-400.webp','downloadedSha256':'9eb415b49fc6ca4616cab5d21a8f09483f1a39a74fa0904be18c3b7c7d42d2c8'},
 '30':{'title':'Close up of Yellow Cake','sourcePage':'https://www.pexels.com/photo/close-up-of-yellow-cake-16526021/','sourceUrl':'https://images.pexels.com/photos/16526021/pexels-photo-16526021.jpeg?cs=srgb&dl=pexels-jimmy-liao-3615017-16526021.jpg&fm=jpg','creator':'Jimmy Liao','license':'Pexels License','licenseUrl':'https://www.pexels.com/license/','downloadDate':'2026-10-20','description':'Close-up of a vibrant mango tart showcasing juicy diced fruit and a hint of red topping.','path':'assets/images/menu-v4/item-30.webp','smallPath':'assets/images/menu-v4/item-30-400.webp','downloadedSha256':'f5aa294846990ded035b39e80f79252110a274b43c0b5b40d9042fb0cabadf68'},
}
data=json.loads((ROOT/'data/product-photos.json').read_text(encoding='utf-8'));byid={p['id']:p for p in data}
baseline=list(csv.DictReader((ROOT/'data/menu-baseline.csv').open(encoding='utf-8-sig',newline='')))
rows=[]
for n,item in enumerate(baseline,1):
 id=f'{n:02d}';p=byid.get(id,{'id':id});p['menuId']='menu-item-'+id;p['productName']=item['product_name']
 if id in sourceOverrides:p.update(sourceOverrides[id])
 if id in reasons:
  if p.get('title'):p['rejectedCandidate']={'title':p['title'],'sourcePage':p['sourcePage'],'reason':reasons[id]}
  for key in ('path','smallPath'):
   if p.get(key):
    src=(ROOT/p[key]).resolve();assert src.parent==ROOT/'assets/images/menu-v4'
    if src.exists():shutil.copy2(src,ROOT/'artifacts/v4/photo-research'/('rejected-'+src.name));src.unlink()
  p.update(status='unresolved',matchNotes=reasons[id],path='',smallPath='',alt='')
 else:
  assert id in alts and p.get('path'),f'Missing reviewed photo {id}'
  p.pop('rejectedCandidate',None)
  p.update(status='verified',alt=alts[id],matchNotes=matchNotes.get(id,'Inspected in candidate/replacement contact sheets on 2026-10-20. Source file identifies the named drink/bake; visible appearance corresponds to the menu concept. Independently sourced depiction, not a KopiKita product shoot.'))
  if id=='14':p['attributionNotes']=p['creator'];p['creator']='Evilphil77 (Commons attribution)'
  if p.get('licenseUrl','').startswith('http:'):p['licenseUrl']=p['licenseUrl'].replace('http:','https:',1)
  if p.get('license')=='Public domain' and not p.get('licenseUrl'):p['licenseUrl']=p['sourcePage']+'#Licensing'
  if p.get('sourceSha256'):p['downloadedSha256']=p.pop('sourceSha256')
  with Image.open(ROOT/p['path']) as image:p['width'],p['height']=image.size
  with Image.open(ROOT/p['smallPath']) as image:p['smallWidth'],p['smallHeight']=image.size
 rows.append(p)
(ROOT/'data/product-photos.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# Update only execution columns in the supplied checklist; canonical text stays unchanged.
check=ROOT/'KopiKita-V4-Codex-Handoff/ASSETS/product-photo-requirements.csv'
with check.open(encoding='utf-8-sig',newline='') as f:reader=csv.DictReader(f);fields=reader.fieldnames;checks=list(reader)
for r,p,b in zip(checks,rows,baseline):
 for field,key in [('category_key','category_key'),('product_name','product_name'),('exact_description','description'),('display_price','display_price')]:assert r[field]==b[key]
 ok=p['status']=='verified'
 r.update(local_webp_path=p.get('path',''),photo_page_url=p.get('sourcePage','') if ok else '',creator=p.get('creator','') if ok else '',license=p.get('license','') if ok else '',license_url=p.get('licenseUrl','') if ok else '',download_date=p.get('downloadDate','') if ok else '',authentic_photo_verified='YES' if ok else 'NO',visual_match_verified='YES' if ok else 'NO',credit_required='YES' if ok else '',remarks=p['matchNotes'])
with check.open('w',encoding='utf-8',newline='') as f:writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader();writer.writerows(checks)
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',15)
sheet=Image.new('RGB',(1500,6*290),'#f8ecd9');d=ImageDraw.Draw(sheet)
cards=[]
for n,(p,b) in enumerate(zip(rows,baseline)):
 x=n%5*300;y=n//5*290;ok=p['status']=='verified'
 if ok:
  image=ImageOps.fit(Image.open(ROOT/p['path']),(280,205),centering=(.5,.65));sheet.paste(image,(x+10,y+8))
 else:d.rectangle((x+10,y+8,x+290,y+213),fill='#d5b592');d.text((x+25,y+95),'PHOTO UNRESOLVED',font=font,fill='#0b231d')
 d.text((x+10,y+220),p['id']+' '+b['product_name'],font=font,fill='#0b231d')
 if ok:
  d.text((x+10,y+242),p['creator'][:30],font=font,fill='#0b231d');d.text((x+10,y+263),p['license'],font=font,fill='#0b231d')
 media=f'<img src="../{p["path"]}" alt="{html.escape(p["alt"])}">' if ok else '<div class="missing">Photograph unresolved</div>'
 credit=f'<a href="{p["sourcePage"]}">{html.escape(p["title"])}</a><p>{html.escape(p["creator"])} · <a href="{p["licenseUrl"]}">{p["license"]}</a></p>' if ok else html.escape(p['matchNotes'])
 cards.append(f'<article>{media}<h2>{p["id"]} {html.escape(b["product_name"])}</h2>{credit}</article>')
sheet.save(ROOT/'artifacts/v4/photo-contact-sheet.jpg',quality=90)
(ROOT/'reports/photo-contact-sheet.html').write_text('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>KopiKita V4 photo review</title><style>body{background:#f8ecd9;color:#0b231d;font:16px Arial;padding:24px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:24px}img,.missing{width:100%;height:220px;object-fit:contain;background:#d5b592}h2{font-size:22px}a{color:inherit}.missing{display:grid;place-items:center}</style><h1>KopiKita V4 photographic coverage — '+str(len(alts))+'/30 verified</h1><p>All 30 menu images are independent genuine photographs used as illustrative representations, not images of products prepared or photographed by KopiKita. Resized/cropped WebP adaptations follow their recorded licenses and are credited below; no endorsement is implied.</p><main>'+''.join(cards)+'</main></html>',encoding='utf-8')
print(f'Reviewed {len(alts)}/30 verified; {len(reasons)} unresolved.')
