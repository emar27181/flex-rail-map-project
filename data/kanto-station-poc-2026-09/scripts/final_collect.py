import json, subprocess, math, re, os
EP="https://overpass.private.coffee/api/interpreter"
co=json.load(open('stations_final.json'))
AMEN='restaurant|fast_food|food_court|cafe|hospital|clinic|library|kindergarten|nursery|school|university|college|coworking_space|cinema|bank|pharmacy|post_office'
SHOP='books|convenience|supermarket|department_store|mall'
LEIS='park|garden|fitness_centre|sports_centre'
TOUR='hotel|guest_house|hostel|attraction|museum|gallery|zoo|aquarium|theme_park'
def q(st):
    lat,lon=co[st]
    return (f'[out:json][timeout:120];('
        f'node["amenity"~"^{AMEN}$"](around:800,{lat},{lon});way["amenity"~"^{AMEN}$"](around:800,{lat},{lon});relation["amenity"~"^{AMEN}$"](around:800,{lat},{lon});'
        f'node["shop"~"^{SHOP}$"](around:800,{lat},{lon});way["shop"~"^{SHOP}$"](around:800,{lat},{lon});relation["shop"~"^{SHOP}$"](around:800,{lat},{lon});'
        f'node["leisure"~"^{LEIS}$"](around:800,{lat},{lon});way["leisure"~"^{LEIS}$"](around:800,{lat},{lon});relation["leisure"~"^{LEIS}$"](around:800,{lat},{lon});'
        f'node["office"](around:800,{lat},{lon});way["office"](around:800,{lat},{lon});relation["office"](around:800,{lat},{lon});'
        f'node["tourism"~"^{TOUR}$"](around:800,{lat},{lon});way["tourism"~"^{TOUR}$"](around:800,{lat},{lon});relation["tourism"~"^{TOUR}$"](around:800,{lat},{lon});'
        f');out tags center;')
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
def hav2(la1,lo1,la2,lo2):
    R=6371000; p=math.pi/180
    dla=(la2-la1)*p; dlo=(lo2-lo1)*p
    a=math.sin(dla/2)**2+math.cos(la1*p)*math.cos(la2*p)*math.sin(dlo/2)**2
    return 2*R*math.asin(a**0.5)
res={}; fails=[]
for st in co:
    try:
        r=subprocess.run(["curl","-sS","-m","150","-A","Mozilla/5.0","--data-urlencode","data="+q(st),EP,"-o","tmp_st.json"],capture_output=True,text=True,timeout=160)
        d=json.load(open('tmp_st.json'))
        els=d.get('elements',[])
        cnt={k:0 for k in CATS}
        for el in els:
            t=el.get('tags',{})
            c=el.get('center') or {'lat':el.get('lat'),'lon':el.get('lon')}
            if not c.get('lat'): continue
            if hav2(co[st][0],co[st][1],c['lat'],c['lon'])<=800.5:
                for k,f in CATS.items():
                    if f(t): cnt[k]+=1
        res[st]=cnt
        print(st,'ok',{k:v for k,v in cnt.items() if v>0})
    except Exception as ex:
        fails.append(st); print(st,'FAIL',str(ex)[:120])
json.dump(res,open('osm_counts.json','w'),ensure_ascii=False,indent=1)
print('FAILED:',fails)
# --- congestion extraction ---
try:
    txt=open('cong2025.txt',encoding='utf-8',errors='ignore').read()
    flat=re.sub(r'\s+','',txt)
    segs={'北池袋→池袋':'池袋','池袋→椎名町':'池袋','下落合→高田馬場':'新宿','中野→新宿':'新宿','代々木→千駄ヶ谷':'新宿','池尻大橋→渋谷':'渋谷','祐天寺→中目黒':'渋谷','渋谷→表参道':'渋谷','川崎→品川':'品川','武蔵小杉→西大井':'品川','戸部→横浜':'横浜','新大塚→茗荷谷':'東京','新小岩→錦糸町':'東京','東池袋→護国寺':'池袋','川口→赤羽':'大宮(非該当)'}
    found={}
    for seg in segs:
        s=re.sub(r'\s+','',seg)
        i=flat.find(s)
        if i>=0:
            tail=flat[i:i+80]
            m=re.findall(r'\d{2,3}(?=%|$)|(\d{2,3})',tail)
            nums=re.findall(r'(\d{1,3})',tail)
            found[seg]=tail[:40]
    print('CONG RAW:'); [print(' ',k,'->',v) for k,v in found.items()]
except Exception as ex: print('cong fail',ex)
