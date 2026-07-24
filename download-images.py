import urllib.request
import urllib.parse
import json
import os
import time

destinations = [
  { 'slug': 'tegenungan-waterfall', 'search': 'Tegenungan Waterfall' },
  { 'slug': 'bali-zoo', 'search': 'Bali Zoo' },
  { 'slug': 'sukawati-art-market', 'search': 'Sukawati Market' },
  { 'slug': 'celuk-village', 'search': 'Celuk silver' },
  { 'slug': 'mas-village', 'search': 'Mas wood carving Bali' },
  { 'slug': 'kemenuh-butterfly-park', 'search': 'Bali butterfly' },
  { 'slug': 'kanto-lampo-waterfall', 'search': 'Kanto Lampo' },
  { 'slug': 'bali-reptile-park', 'search': 'Komodo dragon Bali' },
  { 'slug': 'bali-bird-park', 'search': 'Bali Bird Park' },
  { 'slug': 'penglipuran-village', 'search': 'Penglipuran' },
  { 'slug': 'kehen-temple', 'search': 'Pura Kehen' },
  { 'slug': 'besakih-temple', 'search': 'Pura Besakih' },
  { 'slug': 'tirta-gangga', 'search': 'Tirta Gangga' },
  { 'slug': 'virgin-beach', 'search': 'Virgin Beach Bali' },
  { 'slug': 'lempuyang-temple', 'search': 'Pura Lempuyang' },
  { 'slug': 'taman-ujung', 'search': 'Taman Ujung' },
  { 'slug': 'amed', 'search': 'Amed Bali' },
  { 'slug': 'candidasa', 'search': 'Candidasa' },
  { 'slug': 'mount-agung', 'search': 'Mount Agung' },
  { 'slug': 'tulamben', 'search': 'Tulamben shipwreck' },
  { 'slug': 'sidemen', 'search': 'Sidemen Bali' },
  { 'slug': 'kusamba-beach', 'search': 'Kusamba salt' },
  { 'slug': 'goa-lawah-temple', 'search': 'Goa Lawah' },
  { 'slug': 'puputan-klungkung-monument', 'search': 'Puputan Klungkung' },
  { 'slug': 'kerta-gosa', 'search': 'Kerta Gosa' },
  { 'slug': 'blue-lagoon-beach', 'search': 'Blue Lagoon Bali' },
  { 'slug': 'padangbai', 'search': 'Padangbai' }
]

def fetch_wiki_image(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            if pages:
                page_id = list(pages.keys())[0]
                info = pages[page_id]['imageinfo'][0]
                if 'thumburl' in info:
                    return {'url': info['thumburl'], 'title': pages[page_id]['title']}
    except Exception as e:
        pass
    return None

def download_image(url, dest_path):
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as response, open(dest_path, 'wb') as out_file:
            out_file.write(response.read())
        return True
    except Exception as e:
        return False

def run():
    out_dir = os.path.join(os.getcwd(), 'client', 'public', 'images', 'destinations', 'phase-4')
    os.makedirs(out_dir, exist_ok=True)
    results = []

    for dest in destinations:
        print(f"Searching {dest['search']}...")
        img_info = fetch_wiki_image(dest['search'])
        if img_info:
            print(f"Found: {img_info['url']}")
            ext = img_info['url'].split('.')[-1].split('?')[0].lower()
            if ext not in ['jpg', 'jpeg', 'png', 'webp']: ext = 'jpg'
            if ext == 'jpeg': ext = 'jpg'
            
            dest_file = os.path.join(out_dir, f"{dest['slug']}.{ext}")
            if download_image(img_info['url'], dest_file):
                results.append({
                    'slug': dest['slug'],
                    'url': f"/images/destinations/phase-4/{dest['slug']}.{ext}",
                    'attribution': f"Wikimedia Commons ({img_info['title']})"
                })
            else:
                print("Failed to download")
        else:
            print("No image found")
        time.sleep(0.5)

    with open('wiki-images.json', 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Done. Saved {len(results)} images.")

run()
