import json, subprocess, math, time, csv, os
EP="https://overpass.private.coffee/api/interpreter"
co=json.load(open('stations_final.json'))
counts=json.load(open('osm_counts.json'))
AMEN='restaurant|fast_food|food_court|cafe|hospital|clinic|library|kindergarten|nursery|school|university|college|coworking_space|cinema|bank|pharmacy|post_office'
SHOP='books|convenience|supermarket|department_store|mall'
LEIS='park|garden|fitness_centre|sports_centre'
TOUR='hotel|guest_house|hostel|attraction|museum|gallery|zoo|aquarium|theme_park'
CATS={
 'restaurantCount':lambda t:t.get('amenity')=='restaurant',
 'fastFoodCount':lambda t:t.get('amenity') in('fast_food','food_court'),
 'cafeCount':lambda t:t.get('amenity')=='cafe',
 'convenienceStoreCount':lambda t:t.get('shop')=='convenience',
 'supermarketCount':lambda t:t.get('shop')=='supermarket',
 'bookstoreCount':lambda t:t.get('shop')=='books',
 'mallCount':lambda t:t.get('shop') in('mall','department_store'),
 'hospitalCount':lambda t:t.get('amenity')=='hospital',
 'clinicCount':lambda t:t.get('amenity')=='clinic',
 'pharmacyCount':lambda t:t.get('amenity')=='pharmacy',
 'libraryCount':lambda t:t.get('amenity')=='library',
 'nurseryCount':lambda t:t.get('amenity') in('kindergarten','nursery'),
 'schoolCount':lambda t:t.get('amenity')=='school',
 'universityCount':lambda t:t.get('amenity') in('university','college'),
 'coworkingCount':lambda t:t.get('amenity')=='coworking_space' or t.get('office')=='coworking',
 'officeCount':lambda t:'office' in t and t.get('office')!='coworking',
 'cinemaCount':lambda t:t.get('amenity')=='cinema',
 'gymCount':lambda t:t.get('leisure') in('fitness_centre','sports_centre'),
 'hotelCount':lambda t:t.get('tourism') in('hotel','hostel','guest_house'),
 'attractionCount':lambda t:t.get('tourism') in('attraction','museum','gallery','zoo','aquarium','theme_park'),
 'parkCount':lambda t:t.get('leisure') in('park','garden'),
 'bankCount':lambda t:t.get('amenity')=='bank',
 'postOfficeCount':lambda t:t.get('amenity')=='post_office',
 'izakayaTaggedCount':lambda t:'izakaya' in t.get('cuisine',''),
 'ramenTaggedCount':lambda t:'ramen' in t.get('cuisine',''),
}
def q(st):
    lat,lon=co[st]
    return ('[out:json][timeout:120];('
        f'node["amenity"~"^{AMEN}$"](around:800,{lat},{lon});way["amenity"~"^{AMEN}$"](around:800,{lat},{lon});relation["amenity"~"^{AMEN}$"](around:800,{lat},{lon});'
        f'node["shop"~"^{SHOP}$"](around:800,{lat},{lon});way["shop"~"^{SHOP}$"](around:800,{lat},{lon});relation["shop"~"^{SHOP}$"](around:800,{lat},{lon});'
        f'node["leisure"~"^{LEIS}$"](around:800,{lat},{lon});way["leisure"~"^{LEIS}$"](around:800,{lat},{lon});relation["leisure"~"^{LEIS}$"](around:800,{lat},{lon});'
        f'node["office"](around:800,{lat},{lon});way["office"](around:800,{lat},{lon});relation["office"](around:800,{lat},{lon});'
        f'node["tourism"~"^{TOUR}$"](around:800,{lat},{lon});way["tourism"~"^{TOUR}$"](around:800,{lat},{lon});relation["tourism"~"^{TOUR}$"](around:800,{lat},{lon});'
        ');out tags center;')
def hav2(la1,lo1,la2,lo2):
    R=6371000; p=math.pi/180
    dla=(la2-la1)*p; dlo=(lo2-lo1)*p
    a=math.sin(dla/2)**2+math.cos(la1*p)*math.cos(la2*p)*math.sin(dlo/2)**2
    return 2*R*math.asin(a**0.5)
for st in list(co):
    if st in counts and counts[st]: continue
    ok=False
    for attempt in (1,2):
        try:
            subprocess.run(["curl","-sS","-m","170","-A","Mozilla/5.0","--data-urlencode","data="+q(st),EP,"-o","tmp_r.json"],timeout=180)
            d=json.load(open('tmp_r.json')); els=d.get('elements',[])
            if not els: raise ValueError('empty')
            cnt={k:0 for k in CATS}
            for el in els:
                t=el.get('tags',{}); c=el.get('center') or {'lat':el.get('lat'),'lon':el.get('lon')}
                if not c.get('lat'): continue
                if hav2(co[st][0],co[st][1],c['lat'],c['lon'])<=800.5:
                    for k,f in CATS.items():
                        if f(t): cnt[k]+=1
            counts[st]=cnt; ok=True; print(st,'OK retry'); break
        except Exception as ex:
            print(st,f'attempt{attempt} fail',str(ex)[:80]); time.sleep(8)
    if not ok: counts[st]={}
json.dump(counts,open('osm_counts.json','w'),ensure_ascii=False,indent=1)
print('have:',[s for s in co if counts.get(s) is not None and counts[s] is not False])
# 西武池袋線(椎名町→池袋)の抽出試行
import re
txt=open('cong2025.txt',encoding='utf-8',errors='ignore').read()
flat=re.sub(r'\s+','',txt)
i=flat.find('椎名町→池袋')
print('SEIBU RAW:', flat[i:i+60] if i>=0 else 'NOT FOUND')
