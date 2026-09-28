import json, subprocess, math, re, sys
EP="https://overpass.private.coffee/api/interpreter"
def ov(q, out):
    r=subprocess.run(["curl","-sS","-m","170","-A","Mozilla/5.0 FlexRailPoC/1.0","--data-urlencode","data="+q,EP,"-o",out],capture_output=True,text=True)
    if r.returncode!=0: print("curl fail",out,r.stderr[:200]); sys.exit(1)

names=['東京','新宿','渋谷','池袋','品川','横浜','川崎','藤沢','大宮','千葉']
# debug: names around Tokyo st
ov('[out:json][timeout:30];node(35.678,139.758,35.692,139.772)[railway=station];out tags;','dbg.json')
try:
    d=json.load(open('dbg.json'))
    print("DEBUG names:", [e.get('tags',{}).get('name') for e in d.get('elements',[])][:20])
except Exception as ex: print("dbg parse fail",ex); sys.exit(1)

q1='[out:json][timeout:60];(node["railway"="station"]["name"~"^(東京|新宿|渋谷|池袋|品川|横浜|川崎|藤沢|大宮|千葉)駅?$"](35.2,139.3,36.0,140.3);way["railway"="station"]["name"~"^(東京|新宿|渋谷|池袋|品川|横浜|川崎|藤沢|大宮|千葉)駅?$"](35.2,139.3,36.0,140.3););out center tags;'
ov(q1,'st.json')
d=json.load(open('st.json'))
groups={n:[] for n in names}
for el in d.get('elements',[]):
    nm=el.get('tags',{}).get('name','')
    base=re.sub(r'(駅|えき)$','',nm)
    if base in groups:
        c=el.get('center') or {'lat':el.get('lat'),'lon':el.get('lon')}
        if c.get('lat'): groups[base].append((c['lat'],c['lon']))
coords={n:(round(sum(p[0] for p in pts)/len(pts),6),round(sum(p[1] for p in pts)/len(pts),6)) for n,pts in groups.items() if pts}
print("STATIONS:",json.dumps(coords,ensure_ascii=False))
if len(coords)<10: print("WARN missing:",set(names)-set(coords))
json.dump(coords,open('stations_final.json','w'),ensure_ascii=False)

flat=",".join(f"{lat},{lon}" for lat,lon in coords.values())
AMEN='restaurant|fast_food|food_court|cafe|hospital|clinic|library|kindergarten|nursery|school|university|college|coworking_space|cinema|bank|pharmacy|post_office|police|fire_station'
SHOP='books|convenience|supermarket|department_store|mall'
LEIS='park|garden|fitness_centre|sports_centre'
TOUR='hotel|guest_house|hostel|attraction|museum|gallery|zoo|aquarium|theme_park'
q2=f'[out:json][timeout:240];(node["amenity"~"^{AMEN}$"](around:800,{flat});way["amenity"~"^{AMEN}$"](around:800,{flat});relation["amenity"~"^{AMEN}$"](around:800,{flat});node["shop"~"^{SHOP}$"](around:800,{flat});way["shop"~"^{SHOP}$"](around:800,{flat});relation["shop"~"^{SHOP}$"](around:800,{flat});node["leisure"~"^{LEIS}$"](around:800,{flat});way["leisure"~"^{LEIS}$"](around:800,{flat});relation["leisure"~"^{LEIS}$"](around:800,{flat});node["office"](around:800,{flat});way["office"](around:800,{flat});relation["office"](around:800,{flat});node["tourism"~"^{TOUR}$"](around:800,{flat});way["tourism"~"^{TOUR}$"](around:800,{flat});relation["tourism"~"^{TOUR}$"](around:800,{flat}););out tags center;'
print("query2 len",len(q2)); ov(q2,'poi.json')
print("poi bytes",__import__('os').path.getsize('poi.json'))
q3=f'[out:json][timeout:240];(way["leisure"~"^(park|garden)$"](around:800,{flat});relation["leisure"~"^(park|garden)$"](around:800,{flat}););out geom tags;'
ov(q3,'parks.json')
print("parks bytes",__import__('os').path.getsize('parks.json'))
