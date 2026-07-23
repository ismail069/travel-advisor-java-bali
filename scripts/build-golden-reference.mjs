import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDirs = [
  path.join(repo, 'client/content/golden-reference/source'),
  path.join(repo, 'client/content/phase-4/source'),
  path.join(repo, 'client/content/phase-4/batch-02'),
  path.join(repo, 'client/content/phase-4/batch-03'),
  path.join(repo, 'client/content/phase-4/batch-04'),
  path.join(repo, 'client/content/phase-4/batch-05'),
];
const outputRoot = path.join(repo, 'client/content/destinations');
const imageBySlug = {
  'tanah-lot': '/images/destinations/licensed/135-pura-tanah-lot.webp',
  'uluwatu-temple': '/images/destinations/licensed/134-pura-uluwatu.webp',
  'tegallalang-rice-terrace': '/images/destinations/golden/tegallalang-rice-terrace.webp',
  'sacred-monkey-forest-ubud': '/images/destinations/golden/sacred-monkey-forest-ubud.webp',
  'tirta-empul-temple': '/images/destinations/golden/tirta-empul-temple.webp',
  'campuhan-ridge-walk': '/images/destinations/phase-4/campuhan-ridge-walk.webp',
  'goa-gajah': '/images/destinations/phase-4/goa-gajah.webp',
  'jatiluwih-rice-terraces': '/images/destinations/phase-4/jatiluwih-rice-terraces.webp',
  'ulun-danu-beratan-temple': '/images/destinations/phase-4/ulun-danu-beratan-temple.webp',
  'sekumpul-waterfall': '/images/destinations/phase-4/sekumpul-waterfall.webp',
  'lovina-beach': '/images/destinations/phase-4/lovina-beach.webp',
  'munduk': '/images/destinations/phase-4/munduk.webp',
  'kelingking-beach': '/images/destinations/phase-4/kelingking-beach.webp',
  'broken-beach': '/images/destinations/phase-4/broken-beach.webp',
  'angels-billabong': '/images/destinations/phase-4/angels-billabong.webp',
  'bali-botanic-garden': '/images/destinations/phase-4/bali-botanic-garden.webp',
  'handara-gate': '/images/destinations/phase-4/handara-gate.webp',
  'banyumala-twin-waterfalls': '/images/destinations/phase-4/banyumala-twin-waterfalls.webp',
  'banjar-hot-springs': '/images/destinations/phase-4/banjar-hot-springs.webp',
  'brahmavihara-arama': '/images/destinations/phase-4/brahmavihara-arama.webp',
  'ubud-palace': '/images/destinations/phase-4/ubud-palace.webp',
  'ubud-art-market': '/images/destinations/phase-4/ubud-art-market.webp',
  'saraswati-temple-ubud': '/images/destinations/phase-4/saraswati-temple-ubud.jpg',
  'blanco-renaissance-museum': '/images/destinations/phase-4/blanco-renaissance-museum.webp',
  'museum-puri-lukisan': '/images/destinations/phase-4/museum-puri-lukisan.webp',
  'neka-art-museum': '/images/destinations/phase-4/neka-art-museum.jpg',
  'arma-museum': '/images/destinations/phase-4/arma-museum.webp',
  'nusa-dua-beach': '/images/destinations/phase-4/nusa-dua-beach.webp',
  'water-blow-nusa-dua': '/images/destinations/phase-4/water-blow-nusa-dua.webp',
  'garuda-wisnu-kencana': '/images/destinations/phase-4/garuda-wisnu-kencana.webp',
  'jimbaran-beach': '/images/destinations/phase-4/jimbaran-beach.webp',
  'tegenungan-waterfall': '/images/destinations/phase-4/tegenungan-waterfall.webp',
  'bali-zoo': '/images/destinations/phase-4/bali-zoo.webp',
  'sukawati-art-market': '/images/destinations/phase-4/sukawati-art-market.webp',
  'celuk-village': '/images/destinations/phase-4/celuk-village.webp',
  'mas-village': '/images/destinations/phase-4/mas-village.webp',
  'batuan-village': '/images/destinations/phase-4/batuan-village.webp',
  'batuan-temple': '/images/destinations/phase-4/batuan-temple.webp',
  'bali-bird-park': '/images/destinations/phase-4/bali-bird-park.webp',
  'bali-reptile-park': '/images/destinations/phase-4/bali-reptile-park.webp',
  'kanto-lampo-waterfall': '/images/destinations/phase-4/kanto-lampo-waterfall.webp',
  'kemenuh-butterfly-park': '/images/destinations/phase-4/kemenuh-butterfly-park.webp',
  'tibumana-waterfall': '/images/destinations/phase-4/tibumana-waterfall.webp',
  'tukad-cepung-waterfall': '/images/destinations/phase-4/tukad-cepung-waterfall.webp',
  'penglipuran-village': '/images/destinations/phase-4/penglipuran-village.webp',
  'kehen-temple': '/images/destinations/phase-4/kehen-temple.webp',
  'besakih-temple': '/images/destinations/phase-4/besakih-temple.webp',
  'tirta-gangga': '/images/destinations/phase-4/tirta-gangga.webp',
  'virgin-beach': '/images/destinations/phase-4/virgin-beach.webp',
  'lempuyang-temple': '/images/destinations/phase-4/lempuyang-temple.webp',
  'taman-ujung': '/images/destinations/phase-4/taman-ujung.webp',
  'amed': '/images/destinations/phase-4/amed.webp',
  'candidasa': '/images/destinations/phase-4/candidasa.webp',
  'mount-agung': '/images/destinations/phase-4/mount-agung.webp',
  'tulamben': '/images/destinations/phase-4/tulamben.webp',
  'sidemen': '/images/destinations/phase-4/sidemen.webp',
  'kusamba-beach': '/images/destinations/phase-4/kusamba-beach.webp',
  'goa-lawah-temple': '/images/destinations/phase-4/goa-lawah-temple.webp',
  'puputan-klungkung-monument': '/images/destinations/phase-4/puputan-klungkung-monument.webp',
  'kerta-gosa': '/images/destinations/phase-4/kerta-gosa.webp',
  'blue-lagoon-beach': '/images/destinations/phase-4/blue-lagoon-beach.webp',
  'padangbai': '/images/destinations/phase-4/padangbai.webp',
};
const phase4Metadata = {
  'campuhan-ridge-walk': { idTitle: 'Campuhan Ridge Walk: Panduan Jalur Ubud', enTitle: 'Campuhan Ridge Walk: Ubud Trail Guide', idDescription: 'Panduan Campuhan Ridge Walk di Ubud: waktu terbaik, kondisi jalur, akses, fasilitas, dan tips berjalan aman.', enDescription: 'Plan Campuhan Ridge Walk in Ubud with practical guidance on timing, trail conditions, access, facilities, and walking safely.' },
  'goa-gajah': { idTitle: 'Goa Gajah Bali: Panduan Situs Bersejarah', enTitle: 'Goa Gajah Bali: Elephant Cave Guide', idDescription: 'Panduan mengunjungi Goa Gajah dekat Ubud, mencakup sejarah, tiket, akses tangga, fasilitas, dan etika di kawasan suci.', enDescription: 'Visit Goa Gajah near Ubud with guidance on history, tickets, stairs, facilities, and respectful conduct at this sacred site.' },
  'jatiluwih-rice-terraces': { idTitle: 'Jatiluwih Bali: Panduan Terasering Subak', enTitle: 'Jatiluwih Bali: Rice Terrace Travel Guide', idDescription: 'Rencanakan kunjungan ke Terasering Jatiluwih: rute berjalan, waktu terbaik, tiket, cuaca, dan lanskap budaya subak Bali.', enDescription: 'Plan a visit to Jatiluwih Rice Terraces, including walking routes, timing, tickets, weather, and Bali’s subak landscape.' },
  'ulun-danu-beratan-temple': { idTitle: 'Pura Ulun Danu Beratan: Panduan Bedugul', enTitle: 'Ulun Danu Beratan Temple: Bedugul Guide', idDescription: 'Panduan Pura Ulun Danu Beratan di Bedugul: cuaca, waktu terbaik, tiket, fasilitas, akses, dan etika kunjungan.', enDescription: 'Plan an Ulun Danu Beratan Temple visit with practical details on weather, timing, tickets, facilities, access, and etiquette.' },
  'sekumpul-waterfall': { idTitle: 'Air Terjun Sekumpul: Panduan Trek Bali Utara', enTitle: 'Sekumpul Waterfall: North Bali Trek Guide', idDescription: 'Panduan Air Terjun Sekumpul: kondisi trek, cuaca, keamanan, akses, fasilitas, dan persiapan perjalanan ke Bali Utara.', enDescription: 'Plan a Sekumpul Waterfall trek with guidance on trail conditions, weather, safety, access, facilities, and North Bali travel.' },
  'lovina-beach': { idTitle: 'Pantai Lovina: Panduan Lumba-Lumba Bali Utara', enTitle: 'Lovina Beach: North Bali Dolphin Guide', idDescription: 'Panduan Pantai Lovina mencakup wisata lumba-lumba yang bertanggung jawab, kondisi laut, akses pantai, dan pilihan perjalanan Bali Utara.', enDescription: 'Plan a Lovina Beach visit with responsible dolphin-watching guidance, sea conditions, beach access, and North Bali travel advice.' },
  'munduk': { idTitle: 'Munduk Bali: Panduan Desa dan Air Terjun', enTitle: 'Munduk Bali: Village and Waterfall Guide', idDescription: 'Panduan Munduk Bali untuk menjelajahi desa pegunungan, air terjun, perkebunan, kondisi jalur, transportasi, dan cuaca.', enDescription: 'Explore Munduk’s highland village, waterfalls, plantations, trail conditions, transport, and weather with this practical guide.' },
  'kelingking-beach': { idTitle: 'Pantai Kelingking: Panduan Aman Nusa Penida', enTitle: 'Kelingking Beach: Nusa Penida Safety Guide', idDescription: 'Panduan Pantai Kelingking dengan informasi akses terkini, risiko jalur curam, kondisi pantai, pembangunan, dan keselamatan tebing.', enDescription: 'Visit Kelingking Beach with current guidance on access, steep-trail risks, beach conditions, construction, and cliff safety.' },
  'broken-beach': { idTitle: 'Broken Beach Nusa Penida: Panduan Pasih Uug', enTitle: 'Broken Beach Nusa Penida: Pasih Uug Guide', idDescription: 'Panduan Broken Beach atau Pasih Uug mencakup akses, kondisi jalur tebing, keamanan, waktu kunjungan, dan destinasi terdekat.', enDescription: 'Plan a Broken Beach or Pasih Uug visit with guidance on access, cliff paths, safety, timing, and nearby destinations.' },
  'angels-billabong': { idTitle: "Angel's Billabong: Panduan Keselamatan Ombak", enTitle: "Angel's Billabong: Wave Safety Guide", idDescription: "Panduan Angel's Billabong Nusa Penida dengan prioritas risiko gelombang, larangan masuk, kondisi batu, akses, dan keselamatan.", enDescription: "Visit Angel's Billabong with safety-first guidance on wave surges, entry restrictions, rocky terrain, access, and current conditions." },
  'bali-botanic-garden': { idTitle: 'Kebun Raya Bali: Panduan Wisata Bedugul', enTitle: 'Bali Botanic Garden: Bedugul Visitor Guide', idDescription: 'Panduan Kebun Raya Bali di Bedugul: jam operasional, tiket, cuaca, fasilitas, akses, dan pilihan aktivitas keluarga.', enDescription: 'Plan a Bali Botanic Garden visit with guidance on opening hours, tickets, weather, facilities, access, and family activities.' },
  'handara-gate': { idTitle: 'Handara Gate Bali: Panduan Foto dan Antrean', enTitle: 'Handara Gate Bali: Photo and Queue Guide', idDescription: 'Panduan Handara Gate mencakup biaya foto, jam buka, antrean, waktu terbaik, fasilitas, dan rute Bedugul–Bali Utara.', enDescription: 'Visit Handara Gate with practical guidance on photo fees, opening hours, queues, timing, facilities, and the North Bali route.' },
  'banyumala-twin-waterfalls': { idTitle: 'Air Terjun Banyumala: Panduan Trek Bali Utara', enTitle: 'Banyumala Twin Waterfalls: Trek Guide', idDescription: 'Panduan Air Terjun Banyumala mencakup kondisi trek, tiket, jam buka, cuaca, berenang, fasilitas, dan keselamatan.', enDescription: 'Plan a Banyumala Twin Waterfalls visit with guidance on trail conditions, tickets, hours, weather, swimming, and safety.' },
  'banjar-hot-springs': { idTitle: 'Air Panas Banjar: Panduan Pemandian Bali Utara', enTitle: 'Banjar Hot Springs: North Bali Visitor Guide', idDescription: 'Panduan Air Panas Banjar dengan jam buka resmi, tiket, biaya tambahan, fasilitas kolam, akses, dan etika pemandian.', enDescription: 'Visit Banjar Hot Springs with guidance on official hours, tickets, extra charges, pools, access, and bathing etiquette.' },
  'brahmavihara-arama': { idTitle: 'Brahmavihara-Arama: Panduan Vihara Bali', enTitle: 'Brahmavihara-Arama: Bali Monastery Guide', idDescription: 'Panduan Brahmavihara-Arama mencakup jam kunjungan, model donasi atau tiket, pakaian sopan, akses, dan etika vihara.', enDescription: 'Visit Brahmavihara-Arama with guidance on hours, donation or admission arrangements, modest dress, access, and etiquette.' },
  'ubud-palace': { idTitle: 'Puri Ubud: Panduan Istana dan Tari Bali', enTitle: 'Ubud Palace: Royal Palace and Dance Guide', idDescription: 'Panduan Puri Saren Agung Ubud: jam kunjungan, akses gratis, jadwal tari malam, tiket pertunjukan, dan rute jalan kaki.', enDescription: 'Visit Ubud Palace with guidance on public hours, free courtyard access, evening dances, performance tickets, and walking routes.' },
  'ubud-art-market': { idTitle: 'Pasar Seni Ubud: Panduan Belanja dan Menawar', enTitle: 'Ubud Art Market: Shopping and Bargaining Guide', idDescription: 'Panduan Pasar Seni Ubud mencakup jam pedagang, cara menawar, pembayaran, kepadatan, etika foto, dan akses pusat Ubud.', enDescription: 'Explore Ubud Art Market with guidance on vendor hours, bargaining, payment, crowds, photo etiquette, and central access.' },
  'blanco-renaissance-museum': { idTitle: 'Museum Blanco Ubud: Panduan Kunjungan', enTitle: 'Blanco Renaissance Museum: Visitor Guide', idDescription: 'Panduan Museum Blanco Ubud mencakup jam buka, tiket, koleksi Antonio Blanco, aturan fotografi, taman, dan kesesuaian keluarga.', enDescription: 'Visit the Blanco Renaissance Museum with guidance on hours, tickets, Antonio Blanco’s collection, photography, gardens, and families.' },
  'museum-puri-lukisan': { idTitle: 'Museum Puri Lukisan: Panduan Seni Bali Ubud', enTitle: 'Museum Puri Lukisan: Ubud Art Guide', idDescription: 'Panduan Museum Puri Lukisan mencakup jam resmi, tiket, koleksi seni Bali, pameran, workshop, fotografi, dan akses.', enDescription: 'Visit Museum Puri Lukisan with official hours, tickets, Balinese art collections, exhibitions, workshops, photography, and access.' },
  'arma-museum': { idTitle: 'ARMA Museum Ubud: Panduan Seni dan Budaya', enTitle: 'ARMA Museum Ubud: Art and Culture Guide', idDescription: 'Panduan ARMA Museum mencakup koleksi, taman, jam buka, tiket, pertunjukan, workshop, program budaya, dan aturan foto.', enDescription: 'Explore ARMA Museum’s collections, gardens, hours, tickets, performances, workshops, cultural programs, and photography rules.' },
  'tegenungan-waterfall': { idTitle: 'Air Terjun Tegenungan: Panduan Bali Selatan', enTitle: 'Tegenungan Waterfall: South Bali Guide', idDescription: 'Panduan Air Terjun Tegenungan mencakup tiket, akses tangga, fasilitas, titik foto, dan lokasi dekat Ubud.', enDescription: 'Visit Tegenungan Waterfall with guidance on tickets, stair access, facilities, photo spots, and its location near Ubud.' },
  'bali-zoo': { idTitle: 'Bali Zoo: Panduan Taman Satwa Gianyar', enTitle: 'Bali Zoo: Gianyar Wildlife Park Guide', idDescription: 'Panduan kunjungan ke Bali Zoo mencakup tiket, jam buka, aksesibilitas kursi roda, interaksi satwa, dan lokasi.', enDescription: 'Plan your Bali Zoo visit with guidance on tickets, hours, wheelchair accessibility, animal programs, and location.' },
  'sukawati-art-market': { idTitle: 'Pasar Seni Sukawati: Panduan Belanja Gianyar', enTitle: 'Sukawati Art Market: Gianyar Shopping Guide', idDescription: 'Panduan berbelanja di Pasar Seni Sukawati mencakup tips menawar harga, jam operasional terbaik, jenis suvenir, dan akses.', enDescription: 'Shop at Sukawati Art Market with practical guidance on haggling tips, best visiting hours, souvenir types, and access.' },
  'celuk-village': { idTitle: 'Desa Celuk: Pusat Kerajinan Perak Bali', enTitle: 'Celuk Village: Bali Silver Craft Center', idDescription: 'Panduan Desa Celuk mencakup wisata belanja perak, harga workshop perhiasan, jam operasional galeri, dan budaya pengrajin.', enDescription: 'Visit Celuk Village with guidance on silver shopping, jewelry workshop prices, gallery opening hours, and artisan culture.' },
  'mas-village': { idTitle: 'Desa Mas: Pusat Ukiran Kayu Bali', enTitle: 'Mas Village: Bali Wood Carving Center', idDescription: 'Panduan berkunjung ke Desa Mas mencakup wisata kerajinan kayu, jam operasional bengkel, tips membeli patung, dan akses lokasi.', enDescription: 'Explore Mas Village with guidance on wood carving art, workshop opening hours, tips for buying sculptures, and location access.' },
  'batuan-village': { idTitle: 'Desa Batuan: Panduan Seni Lukis dan Pura', enTitle: 'Batuan Village: Art and Temple Guide', idDescription: 'Panduan mengunjungi Desa Batuan mencakup galeri seni lukis tradisional, tiket Pura Puseh Batuan, jam buka, dan akses.', enDescription: 'Explore Batuan Village with guidance on traditional painting galleries, Batuan Temple tickets, opening hours, and access.' },
  'batuan-temple': { idTitle: 'Pura Batuan: Panduan Arsitektur Abad ke-11', enTitle: 'Batuan Temple: 11th Century Architecture Guide', idDescription: 'Panduan mengunjungi Pura Batuan mencakup harga tiket, aturan pakaian (sarung), jam operasional, dan nilai sejarah.', enDescription: 'Visit Batuan Temple with guidance on entrance fees, sarong dress codes, opening hours, and historical significance.' },
  'bali-bird-park': { idTitle: 'Bali Bird Park: Panduan Taman Burung Gianyar', enTitle: 'Bali Bird Park: Gianyar Wildlife Guide', idDescription: 'Panduan ke Bali Bird Park mencakup harga tiket, jam pertunjukan, interaksi satwa, fasilitas anak, dan akses lokasi.', enDescription: 'Visit Bali Bird Park with guidance on ticket prices, show schedules, animal interactions, family facilities, and access.' },
  'bali-reptile-park': { idTitle: 'Bali Reptile Park: Panduan Satwa Gianyar', enTitle: 'Bali Reptile Park: Gianyar Wildlife Guide', idDescription: 'Panduan ke Bali Reptile Park mencakup harga tiket, interaksi dengan ular dan komodo, jam buka, dan tips keluarga.', enDescription: 'Visit Bali Reptile Park with guidance on ticket prices, animal encounters, opening hours, and family tips.' },
  'kanto-lampo-waterfall': { idTitle: 'Air Terjun Kanto Lampo: Panduan Wisata Gianyar', enTitle: 'Kanto Lampo Waterfall: Gianyar Guide', idDescription: 'Panduan Air Terjun Kanto Lampo mencakup tiket masuk, tips foto, pemandu lokal, kondisi air, dan lokasi.', enDescription: 'Visit Kanto Lampo Waterfall with guidance on entrance fees, photo tips, local guides, water conditions, and location.' },
  'kemenuh-butterfly-park': { idTitle: 'Kemenuh Butterfly Park: Panduan Wisata Edukasi', enTitle: 'Kemenuh Butterfly Park: Educational Guide', idDescription: 'Panduan Kemenuh Butterfly Park mencakup tiket, jam aktif kupu-kupu, fasilitas keluarga, dan akses wisata Gianyar.', enDescription: 'Explore Kemenuh Butterfly Park with guidance on tickets, active hours, family facilities, and Gianyar access.' },
  'tibumana-waterfall': { idTitle: 'Air Terjun Tibumana: Panduan Wisata Bangli', enTitle: 'Tibumana Waterfall: Bangli Visitor Guide', idDescription: 'Panduan Air Terjun Tibumana mencakup lokasi, harga tiket, jam buka, dan tips wisata alam di Bangli.', enDescription: 'Visit Tibumana Waterfall with guidance on location, entrance fees, opening hours, and nature tips in Bangli.' },
  'tukad-cepung-waterfall': { idTitle: 'Air Terjun Tukad Cepung: Panduan Wisata Bangli', enTitle: 'Tukad Cepung Waterfall: Bangli Visitor Guide', idDescription: 'Panduan Air Terjun Tukad Cepung mencakup lokasi gua, harga tiket, jam buka, dan tips fotografi wisata di Bangli.', enDescription: 'Visit Tukad Cepung Waterfall with guidance on cave location, entrance fees, opening hours, and photography tips in Bangli.' },
  'penglipuran-village': { idTitle: 'Desa Penglipuran: Panduan Wisata Tradisional Bangli', enTitle: 'Penglipuran Village: Traditional Bangli Guide', idDescription: 'Panduan berkunjung ke Desa Penglipuran mencakup harga tiket, jam buka, aturan adat, dan fasilitas wisata di Bangli.', enDescription: 'Visit Penglipuran Village with guidance on entrance fees, opening hours, traditional rules, and facilities in Bangli.' },
  'kehen-temple': { idTitle: 'Pura Kehen: Panduan Wisata Sejarah Bangli', enTitle: 'Kehen Temple: Bangli Historical Guide', idDescription: 'Panduan mengunjungi Pura Kehen mencakup harga tiket, aturan pakaian (sarung), jam buka, dan nilai sejarah di Bangli.', enDescription: 'Visit Kehen Temple with guidance on entrance fees, sarong dress codes, opening hours, and historical significance in Bangli.' },
  'besakih-temple': { idTitle: 'Pura Besakih: Panduan Lengkap Pura Induk Bali', enTitle: 'Besakih Temple: The Mother Temple Guide', idDescription: 'Panduan Pura Besakih mencakup tiket masuk, aturan pemandu lokal, shuttle, jam buka, aturan pakaian, dan fasilitas.', enDescription: 'Visit Besakih Temple with guidance on entrance fees, official local guides, shuttles, opening hours, dress codes, and facilities.' },
  'tirta-gangga': { idTitle: 'Tirta Gangga: Panduan Taman Air Karangasem', enTitle: 'Tirta Gangga: Karangasem Water Palace Guide', idDescription: 'Panduan Tirta Gangga mencakup tiket masuk, jam buka, tips foto, kolam pemandian, dan fasilitas.', enDescription: 'Visit Tirta Gangga with guidance on entrance fees, opening hours, photo tips, swimming pools, and facilities.' },
  'virgin-beach': { idTitle: 'Virgin Beach: Panduan Pantai Perasi Karangasem', enTitle: 'Virgin Beach: Karangasem Beach Guide', idDescription: 'Panduan Virgin Beach Bali mencakup tiket, akses jalan, keamanan berenang, fasilitas, dan warung lokal.', enDescription: 'Visit Virgin Beach with guidance on tickets, road access, swimming safety, facilities, and local warungs.' },
  'lempuyang-temple': { idTitle: 'Pura Lempuyang: Panduan Gate of Heaven Bali', enTitle: 'Lempuyang Temple: Gate of Heaven Guide', idDescription: 'Panduan Pura Lempuyang mencakup tiket, waktu antre foto, shuttle wajib, aturan sarung, dan jam buka.', enDescription: 'Visit Lempuyang Temple with guidance on tickets, photo queue times, mandatory shuttles, sarong rules, and hours.' },
  'taman-ujung': { idTitle: 'Taman Ujung: Panduan Taman Air Karangasem', enTitle: 'Taman Ujung: Karangasem Water Palace Guide', idDescription: 'Panduan Taman Ujung mencakup tiket, jam buka, izin pre-wedding, aturan drone, dan akses.', enDescription: 'Visit Taman Ujung with guidance on tickets, opening hours, pre-wedding shoot permits, drone rules, and access.' },
  'amed': { idTitle: 'Amed Bali: Panduan Menyelam dan Snorkeling', enTitle: 'Amed Bali: Diving and Snorkeling Guide', idDescription: 'Panduan Amed mencakup titik snorkeling terbaik, akses pantai, desa nelayan, dan aktivitas bahari di Karangasem.', enDescription: 'Explore Amed with guidance on the best snorkeling spots, beach access, fishing villages, and marine activities.' },
  'candidasa': { idTitle: 'Candidasa: Panduan Wisata dan Lotus Lagoon', enTitle: 'Candidasa: Lotus Lagoon and Visitor Guide', idDescription: 'Panduan Candidasa mencakup Lotus Lagoon gratis, akses pantai, restoran tepi laut, dan basis eksplorasi Karangasem.', enDescription: 'Visit Candidasa with guidance on the free Lotus Lagoon, waterfront dining, beach access, and exploring East Bali.' },
  'mount-agung': { idTitle: 'Gunung Agung: Panduan Pendakian Puncak Tertinggi Bali', enTitle: 'Mount Agung: Bali Highest Peak Trekking Guide', idDescription: 'Panduan pendakian Gunung Agung mencakup rute Pura Besakih dan Pasar Agung, aturan pemandu wajib, cuaca, dan tingkat kesulitan.', enDescription: 'Prepare for a Mount Agung trek with guidance on routes, mandatory local guides, weather safety, and physical demands.' },
  'tulamben': { idTitle: 'Tulamben Bali: Panduan Menyelam USAT Liberty', enTitle: 'Tulamben Bali: USAT Liberty Diving Guide', idDescription: 'Panduan Tulamben mencakup lokasi bangkai kapal USAT Liberty, pantai batu vulkanik, biaya menyelam, dan akses dari pesisir.', enDescription: 'Explore Tulamben with guidance on diving the USAT Liberty shipwreck, volcanic stone beaches, dive costs, and shore access.' },
  'sidemen': { idTitle: 'Lembah Sidemen: Panduan Wisata Desa Karangasem', enTitle: 'Sidemen Valley: Karangasem Village Guide', idDescription: 'Panduan Sidemen mencakup pemandangan sawah terasering, desa tradisional, resor butik, dan pesona pedesaan yang tenang di Bali Timur.', enDescription: 'Visit Sidemen Valley with guidance on scenic rice terraces, traditional villages, boutique eco-resorts, and a peaceful rural atmosphere.' },
  'kusamba-beach': { idTitle: 'Pantai Kusamba Bali: Panduan Wisata dan Pembuatan Garam', enTitle: 'Kusamba Beach: Salt Making Guide', idDescription: 'Panduan Pantai Kusamba mencakup pembuatan garam laut tradisional, perahu nelayan jukung, dan suasana pesisir otentik di Klungkung.', enDescription: 'Visit Kusamba Beach with guidance on traditional artisanal salt making, fishing boats, and discovering authentic Balinese coastal life.' },
  'goa-lawah-temple': { idTitle: 'Pura Goa Lawah: Panduan Wisata Gua Kelelawar Bali', enTitle: 'Goa Lawah Temple: Bat Cave Guide', idDescription: 'Panduan Pura Goa Lawah mencakup gua kelelawar suci, tiket masuk, aturan berpakaian, dan fungsi pura dalam ritual Hindu.', enDescription: 'Explore Goa Lawah Temple with guidance on the sacred bat cave, entrance fees, dress codes, and its role in Balinese rituals.' },
  'puputan-klungkung-monument': { idTitle: 'Monumen Puputan Klungkung: Panduan Wisata Sejarah Bali', enTitle: 'Puputan Klungkung Monument: History Guide', idDescription: 'Panduan Monumen Puputan Klungkung mencakup sejarah perlawanan 1908, museum diorama, tiket gratis, dan akses di Semarapura.', enDescription: 'Visit the Puputan Klungkung Monument with guidance on the 1908 history, museum dioramas, free admission, and central location.' },
  'kerta-gosa': { idTitle: 'Kerta Gosa Klungkung: Panduan Paviliun Pengadilan Kerajaan', enTitle: 'Kerta Gosa: Royal Court Pavilion Guide', idDescription: 'Panduan Kerta Gosa mencakup lukisan gaya Kamasan, paviliun pengadilan kerajaan, tiket masuk, dan arsitektur bersejarah di Klungkung.', enDescription: 'Explore Kerta Gosa with guidance on Kamasan-style ceiling paintings, royal court history, entrance fees, and Balinese architecture.' },
  'blue-lagoon-beach': { idTitle: 'Blue Lagoon Beach: Panduan Snorkeling Padangbai', enTitle: 'Blue Lagoon Beach: Padangbai Snorkeling Guide', idDescription: 'Panduan Blue Lagoon Beach mencakup titik snorkeling terbaik, akses pantai, harga sewa alat, dan kondisi laut di Padangbai.', enDescription: 'Explore Blue Lagoon Beach with guidance on shore snorkeling, equipment rentals, beach access, and marine conditions.' },
  'padangbai': { idTitle: 'Pelabuhan Padangbai: Panduan Transit Gili & Lombok', enTitle: 'Padangbai Port: Gili & Lombok Transit Guide', idDescription: 'Panduan pelabuhan Padangbai mencakup tiket fast boat ke Gili, peringatan calo transportasi, akses pantai, dan penginapan.', enDescription: 'Navigate Padangbai port with guidance on fast boats to the Gili islands, local transport warnings, beach access, and diving.' },
};

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data = Object.fromEntries((match?.[1] || '').split(/\r?\n/).map((line) => {
    const index = line.indexOf(':');
    return index > 0 ? [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^"|"$/g, '')] : null;
  }).filter(Boolean));
  return { data, body: raw.slice(match?.[0].length || 0) };
}

function localizedCommon(text, locale, data) {
  let result = text;
  const title = locale === 'id' ? data.name.split(' / ')[0] : data.name.split(' / ').at(-1);
  const phase4 = phase4Metadata[data.slug];
  const summary = locale === 'id' ? (data.metaDescriptionId || phase4?.idDescription) : (data.metaDescriptionEn || phase4?.enDescription);
  const imageProps = imageBySlug[data.slug]
    ? `\n  imageSrc="${imageBySlug[data.slug]}"\n  imageAlt="${locale === 'id' ? `Pemandangan ${title}` : `View of ${title}`}"`
    : '';
  result = result.replace(/title="[^"]+"\n  summary="[^"]+"/, `title="${title}"\n  summary="${summary}"${imageProps}`);
  result = result.replace(/"([^"]+\s\/\s[^"]+)"/g, (_, value) => `"${locale === 'id' ? value.split(' / ')[0] : value.split(' / ').at(-1)}"`);
  if (locale === 'id') {
    const replacements = new Map([
      ['Golden Reference Draft', 'Draf Referensi Utama'], ['Bali Golden Reference', 'Referensi Utama Bali'],
      ['Location', 'Lokasi'], ['Suggested duration', 'Durasi disarankan'], ['Best time', 'Waktu terbaik'],
      ['Opening hours', 'Jam operasional'], ['Entrance fee', 'Tiket masuk'], ['Adult ticket', 'Tiket dewasa'],
      ['Child ticket', 'Tiket anak'], ['Accessibility', 'Aksesibilitas'], ['Kecak schedule', 'Jadwal Kecak'],
      ['Last operational check', 'Pemeriksaan operasional terakhir'], ['Needs live verification', 'Perlu verifikasi langsung'],
      ['Early morning', 'Pagi hari'], ['Morning', 'Pagi hari'], ['Late afternoon', 'Menjelang sore'],
      ['Daily', 'Setiap hari'], ['1–1.5 hours', '1–1,5 jam'], ['1–2 hours', '1–2 jam'], ['2–4 hours', '2–4 jam'], ['with performance', 'termasuk pertunjukan'],
      ['verify before publication', 'verifikasi sebelum publikasi'], ['recheck before publication', 'periksa kembali sebelum publikasi'],
      ['From IDR', 'Mulai IDR'], ['verify current category and price', 'verifikasi kategori dan harga terkini'],
      ['Domestic adult', 'Dewasa domestik'], ['foreign adult', 'dewasa mancanegara'], ['verify before travel', 'verifikasi sebelum perjalanan'],
      ['Partial; terrain and crowding vary', 'Sebagian; medan dan kepadatan bervariasi'],
      ['Limited on long paths, slopes, and steps', 'Terbatas pada jalur panjang, lereng, dan tangga'],
      ['Limited on steep and uneven paths', 'Terbatas pada jalur curam dan tidak rata'],
      ['Partial; wet areas and steps require care', 'Sebagian; area basah dan tangga memerlukan kehati-hatian'],
      ['Varies by access point — verify locally', 'Bervariasi menurut titik akses — verifikasi di lokasi'],
      ['Varies by entry point — verify locally', 'Bervariasi menurut pintu masuk — verifikasi di lokasi'],
      ['Scenic beauty', 'Keindahan lanskap'], ['Cultural value', 'Nilai budaya'], ['Photography', 'Fotografi'],
      ['Family suitability', 'Kesesuaian keluarga'], ['Crowd comfort', 'Kenyamanan keramaian'],
      ['Current information', 'Informasi terkini'], ['See Quick Facts', 'Lihat Fakta Singkat'],
      ['Ticket Information', 'Informasi Tiket'], ['Opening Hours', 'Jam Operasional'], ['Facilities', 'Fasilitas'],
      ['Admission', 'Tiket masuk'], ['Opening arrangement', 'Pengaturan akses'], ['Difficulty', 'Tingkat kesulitan'],
      ['Domestic ticket', 'Tiket domestik'], ['Foreign adult ticket', 'Tiket dewasa mancanegara'], ['Foreign child ticket', 'Tiket anak mancanegara'],
      ['Route options', 'Pilihan rute'], ['Weather', 'Cuaca'], ['Ticket and guide arrangement', 'Pengaturan tiket dan pemandu'],
      ['Recommended visiting window', 'Waktu kunjungan yang disarankan'], ['Wheelchair suitability', 'Kesesuaian kursi roda'],
      ['Value', 'Nilai manfaat'], ['Adventure value', 'Nilai petualangan'],
      ['Beach access', 'Akses pantai'], ['Dolphin tours', 'Wisata lumba-lumba'], ['Swimming access', 'Akses berenang'],
      ['Beach character', 'Karakter pantai'], ['Official area', 'Kawasan resmi'], ['Address', 'Alamat'], ['Main risk', 'Risiko utama'], ['Last verified', 'Terakhir diverifikasi'],
      ['Swimming comfort', 'Kenyamanan berenang'], ['Scenic impact', 'Daya tarik panorama'],
      ['Landmark impact', 'Daya tarik landmark'], ['Cultural programming', 'Program budaya'], ['Food experience', 'Pengalaman kuliner'], ['Official phone', 'Telepon resmi'],
      ['Late afternoon through sunset', 'Sore hingga matahari terbenam'],
      ['Beach walk, sunset, and seafood dining', 'Berjalan di pantai, matahari terbenam, dan kuliner seafood'],
      ['Only in suitable sea conditions and designated areas', 'Hanya saat kondisi laut sesuai dan di area yang diperbolehkan'],
      ['Verify the schedule for your selected date on official ticketing', 'Verifikasi jadwal tanggal kunjungan melalui tiket resmi'],
      ['Menjelang sore when combining park exploration and evening performances', 'Menjelang sore untuk menggabungkan eksplorasi taman dan pertunjukan malam'],
      ['Menjelang sore through sunset', 'Sore hingga matahari terbenam'],
      ['Ticketed; prices vary by package and visit date', 'Bertiket; harga mengikuti paket dan tanggal kunjungan'],
      ['Public beach access is generally available; parking or local charges may apply', 'Akses pantai publik umumnya tersedia; biaya parkir atau biaya lokal dapat berlaku'],
      ['South Kuta', 'Kuta Selatan'],
      ['The Nusa Dua tourism area, South Kuta, Badung', 'Kawasan pariwisata The Nusa Dua, Kuta Selatan, Badung'],
      ['Public beach access is generally available; local charges may apply', 'Akses pantai publik umumnya tersedia; biaya lokal dapat berlaku'],
      ['Organized, resort-oriented, and comparatively calm', 'Tertata, berorientasi resor, dan relatif tenang'], ['17 July 2026', '17 Juli 2026'],
      ['Verify current opening hours directly before visiting', 'Verifikasi jam buka terkini secara langsung sebelum berkunjung'],
      ['Verify current admission directly before visiting', 'Verifikasi tiket terkini secara langsung sebelum berkunjung'],
      ['Strong waves, slippery surfaces, and sudden sea spray', 'Gelombang kuat, permukaan licin, dan semburan air laut mendadak'],
      ['Swimming', 'Berenang'], ['Main experiences', 'Pengalaman utama'], ['Transport', 'Transportasi'],
      ['Beach descent', 'Jalur turun ke pantai'], ['Construction', 'Konstruksi'], ['access status', 'status akses'],
      ['Safety comfort', 'Kenyamanan keselamatan'], ['Safety', 'Keselamatan'], ['Wave risk', 'Risiko gelombang'],
      ['Half day to 2 nights', 'Setengah hari hingga 2 malam'], ['1–3 nights', '1–3 malam'],
      ['30–60 minutes', '30–60 menit'], ['20–40 minutes', '20–40 menit'],
      ['Overall access', 'Akses umum'], ['Terrain', 'Medan'], ['Parking', 'Parkir'], ['Toilets', 'Toilet'],
      ['Food and drink', 'Makanan dan minuman'], ['Nearby Destinations', 'Destinasi Terdekat'],
      ['1.5–3 hours', '1,5–3 jam'], ['Late afternoon to evening', 'Sore hingga malam'],
      ['Official social profile lists daily 10:00–22:00 WITA', 'Profil resmi mencantumkan setiap hari pukul 10.00–22.00 WITA'],
      ['No general entrance ticket; spending depends on selected tenants and events', 'Tidak ada tiket masuk umum; pengeluaran bergantung pada tenant dan acara yang dipilih'],
      ['Customer care', 'Layanan pelanggan'], ['Dining variety', 'Variasi kuliner'], ['Shopping value', 'Nilai belanja'], ['Cultural depth', 'Kedalaman budaya'],
      ['Vehicle drop-off', 'Area turun kendaraan'], ['Managed arrival area.', 'Area kedatangan yang dikelola.'],
      ['Paved circulation', 'Jalur beraspal'], ['Primary routes are within a developed retail complex.', 'Jalur utama berada di dalam kompleks ritel yang tertata.'],
      ['Wheelchair access', 'Akses kursi roda'], ['Confirm tenant entrances, gradients, and lifts where relevant.', 'Konfirmasikan akses pintu tenant, kemiringan jalur, dan lift bila diperlukan.'],
      ['Rest seating', 'Tempat duduk istirahat'], ['Available around selected common areas and tenants.', 'Tersedia di beberapa area umum dan tenant.'],
      ['Accessible toilets', 'Toilet aksesibel'], ['Confirm with customer service.', 'Konfirmasikan kepada layanan pelanggan.'],
      ['Restaurants and cafés', 'Restoran dan kafe'], ['Tenant availability changes.', 'Ketersediaan tenant dapat berubah.'],
      ['Retail shops', 'Toko ritel'], ['Lifestyle, fashion, souvenirs, and selected specialty stores.', 'Toko gaya hidup, fesyen, cendera mata, dan toko khusus pilihan.'],
      ['Family entertainment', 'Hiburan keluarga'], ['Current official tenant list includes TIMEZONE.', 'Daftar tenant resmi saat ini mencantumkan TIMEZONE.'],
      ['Current fee and validation policy require confirmation.', 'Biaya dan kebijakan validasi terkini perlu dikonfirmasi.'],
      ['Sunset silhouette', 'Siluet saat matahari terbenam'], ['Coastal walking route', 'Jalur berjalan pesisir'],
      ['Batu Bolong viewpoint', 'Titik pandang Batu Bolong'], ['Active Balinese Hindu setting', 'Kawasan Hindu Bali yang aktif'],
      ['Indian Ocean cliff views', 'Pemandangan tebing Samudra Hindia'], ['Temple architecture and sacred context', 'Arsitektur pura dan konteks kesakralan'],
      ['Sunset atmosphere', 'Suasana matahari terbenam'], ['Kecak performance', 'Pertunjukan Kecak'],
      ['Long-tailed macaques', 'Monyet ekor panjang'], ['Sacred temples and statues', 'Pura dan patung suci'],
      ['Shaded forest paths', 'Jalur hutan yang teduh'], ['Central Ubud location', 'Lokasi di pusat Ubud'],
      ['Holy spring', 'Mata air suci'], ['Purification pools', 'Kolam penyucian'], ['Active temple complex', 'Kompleks pura aktif'],
      ['Tampaksiring cultural route', 'Rute budaya Tampaksiring'],
      ['Arrive 60–90 minutes before sunset if sunset is your priority.', 'Datang 60–90 menit sebelum matahari terbenam bila senja menjadi prioritas.'],
      ['Wear shoes with reliable grip because coastal surfaces may be wet or uneven.', 'Kenakan alas kaki dengan daya cengkeram baik karena permukaan pesisir dapat basah atau tidak rata.'],
      ['Respect barriers and sacred-area restrictions.', 'Hormati pembatas dan larangan memasuki area suci.'],
      ['Allow extra departure time after sunset.', 'Sediakan waktu tambahan untuk keluar setelah matahari terbenam.'],
      ['Secure loose belongings before entering.', 'Amankan barang yang mudah lepas sebelum masuk.'], ['Arrive early if you plan to attend Kecak.', 'Datang lebih awal bila ingin menonton Kecak.'],
      ['Follow sarong and sacred-area rules.', 'Patuhi aturan sarung dan area suci.'], ['Stay behind barriers and away from cliff edges.', 'Tetap di belakang pembatas dan jauhi tepi tebing.'],
      ['Visit early for cooler conditions.', 'Datang lebih pagi saat udara lebih sejuk.'], ['Wear non-slip footwear.', 'Kenakan alas kaki antiselip.'],
      ['Respect crops and farming activity.', 'Hormati tanaman dan kegiatan petani.'], ['Confirm fees or donations before entering a route.', 'Konfirmasikan biaya atau donasi sebelum memasuki jalur.'],
      ['Do not carry exposed food.', 'Jangan membawa makanan secara terbuka.'], ['Secure loose objects.', 'Amankan barang yang mudah lepas.'],
      ['Do not touch or tease the monkeys.', 'Jangan menyentuh atau menggoda monyet.'], ['Follow staff instructions and weather notices.', 'Ikuti arahan staf dan pemberitahuan cuaca.'],
      ['Dress modestly and follow sarong rules.', 'Berpakaian sopan dan patuhi aturan penggunaan sarung.'], ['Do not use water spouts without understanding their purpose.', 'Jangan menggunakan pancuran tanpa memahami fungsinya.'],
      ['Give priority to worshippers.', 'Dahulukan umat yang bersembahyang.'], ['Secure valuables before entering pool areas.', 'Amankan barang berharga sebelum memasuki area kolam.'],
      ['Start early to avoid heat.', 'Mulai lebih pagi untuk menghindari panas.'], ['Carry water because shade is limited.', 'Bawa air minum karena naungan terbatas.'],
      ['Wear shoes suitable for mixed paving and slopes.', 'Kenakan sepatu yang sesuai untuk permukaan campuran dan lereng.'], ['Do not rely on the route for lighting after dark.', 'Jangan mengandalkan penerangan jalur setelah gelap.'],
      ['Allow time for both the cave area and lower paths.', 'Sediakan waktu untuk area gua dan jalur bawah.'], ['Wear modest clothing and follow sarong requirements.', 'Kenakan pakaian sopan dan ikuti ketentuan sarung.'],
      ['Use caution on wet steps.', 'Berhati-hatilah pada tangga yang basah.'], ['Choose a route that matches your time and fitness.', 'Pilih rute sesuai waktu dan kondisi fisik.'],
      ['Carry sun and rain protection.', 'Bawa perlindungan dari matahari dan hujan.'], ['Stay on designated paths and respect farming activity.', 'Tetap di jalur yang ditentukan dan hormati kegiatan pertanian.'],
      ['Check current field conditions before a long route.', 'Periksa kondisi sawah terkini sebelum mengambil rute panjang.'], ['Visit early for clearer conditions.', 'Datang lebih pagi untuk peluang cuaca cerah.'],
      ['Carry a light rain layer.', 'Bawa pelindung hujan ringan.'], ['Respect active worship and restricted areas.', 'Hormati kegiatan ibadah dan area terbatas.'],
      ['Confirm current ticket and opening information directly.', 'Konfirmasikan tiket dan jam operasional terkini secara langsung.'], ['Arrive early.', 'Datang lebih awal.'],
      ['Avoid descending during severe rain.', 'Hindari turun saat hujan lebat.'], ['Wear footwear with strong grip.', 'Kenakan alas kaki dengan daya cengkeram kuat.'],
      ['Confirm the official ticket and route arrangement before starting.', 'Konfirmasikan tiket resmi dan pengaturan rute sebelum memulai.'],
      ['Confirm boat safety equipment and weather policy.', 'Konfirmasikan perlengkapan keselamatan perahu dan kebijakan cuaca.'], ['Do not accept guaranteed wildlife sightings as a certainty.', 'Jangan menganggap jaminan melihat satwa sebagai kepastian.'],
      ['Stay at least one night if planning a pre-dawn boat departure.', 'Menginaplah setidaknya satu malam bila berangkat dengan perahu sebelum fajar.'], ['Use Lovina as a base for nearby North Bali attractions.', 'Gunakan Lovina sebagai basis untuk destinasi Bali Utara di sekitarnya.'],
      ['Allow at least one night to avoid a rushed visit.', 'Sediakan setidaknya satu malam agar kunjungan tidak terburu-buru.'], ['Carry rain protection even outside peak rainy months.', 'Bawa perlindungan hujan meski di luar puncak musim hujan.'],
      ['Use trail shoes for waterfall routes.', 'Gunakan sepatu jalur untuk rute air terjun.'], ['Confirm road and trail conditions with your accommodation.', 'Konfirmasikan kondisi jalan dan jalur dengan akomodasi Anda.'],
      ['Visit early to reduce crowd pressure.', 'Datang lebih awal untuk mengurangi kepadatan.'], ['Stay behind barriers and avoid exposed photo positions.', 'Tetap di belakang pembatas dan hindari posisi foto terbuka.'],
      ['Treat the descent as a serious hike, not a casual staircase.', 'Perlakukan jalur turun sebagai pendakian serius, bukan tangga santai.'], ['Do not swim without explicit current local safety clearance.', 'Jangan berenang tanpa izin keselamatan lokal terkini yang jelas.'],
      ['Wear shoes suitable for uneven ground.', 'Kenakan sepatu yang sesuai untuk permukaan tidak rata.'], ['Keep children close to adults.', 'Pastikan anak selalu dekat dengan orang dewasa.'],
      ['Avoid exposed cliff-edge photo positions.', 'Hindari posisi foto terbuka di tepi tebing.'], ["Combine with Angel's Billabong but allow time for congestion.", "Gabungkan dengan Angel's Billabong, tetapi sediakan waktu untuk kepadatan."],
      ['Do not enter the pool without explicit current authorization.', 'Jangan memasuki kolam tanpa izin terkini yang jelas.'], ['Stay away from wet rock near the ocean edge.', 'Jauhi batu basah di dekat tepi laut.'],
      ['Follow staff instructions immediately.', 'Segera ikuti arahan petugas.'], ['Use footwear with reliable grip.', 'Gunakan alas kaki dengan daya cengkeram baik.'],
    ]);
    for (const [from, to] of replacements) result = result.replaceAll(from, to);
    result = result.replaceAll('<Aksesibilitas', '<Accessibility').replaceAll('<Fasilitas', '<Facilities');
    result = result.replaceAll('title="Sources"', 'title="Sumber"');
    result = result.replace(/, explanation: "[^"]+"/g, '');
    result = result.replace(/, relation: "[^"]+"/g, '');
    result = result.replaceAll('Recheck official sources before publication and before travel.', 'Periksa kembali sumber resmi sebelum publikasi dan perjalanan.');
    result = result.replaceAll('Dynamic information must be verified again.', 'Informasi dinamis harus diverifikasi kembali.');
    result = result.replaceAll('Do not assume a fully step-free route. Confirm current conditions for specific mobility needs.', 'Jangan menganggap seluruh rute bebas tangga. Konfirmasikan kondisi terkini untuk kebutuhan mobilitas tertentu.');
    result = result.replaceAll('Verify slopes, stairs, surfaces, and drop-off distance before publication.', 'Verifikasi kemiringan, tangga, permukaan, dan jarak titik turun sebelum publikasi.');
    result = result.replaceAll('Current arrangement requires verification.', 'Pengaturan terkini perlu diverifikasi.');
    result = result.replaceAll('Location and accessibility require verification.', 'Lokasi dan aksesibilitas perlu diverifikasi.');
    result = result.replaceAll('Availability varies by destination and operating conditions.', 'Ketersediaan mengikuti kondisi operasional destinasi.');
    result = result.replaceAll('Location and accessibility require verification.', 'Lokasi dan aksesibilitas perlu diverifikasi.');
    result = result.replaceAll('Lokasi and accessibility require verification.', 'Lokasi dan aksesibilitas perlu diverifikasi.');
    result = result.replaceAll('Operational facts must be checked again immediately before publication.', 'Fakta operasional harus diperiksa kembali tepat sebelum publikasi.');
    result = result.replaceAll('Pagi hari for comfort; late afternoon for sunset', 'Pagi hari untuk kenyamanan; menjelang sore untuk matahari terbenam');
  } else {
    result = result.replaceAll('Konten ini siap menjadi acuan struktur dan gaya. Informasi dinamis tetap harus diverifikasi lagi tepat sebelum publikasi.', 'This content is ready as a structural and editorial benchmark. Dynamic information must still be rechecked immediately before publication.');
    result = result
      .replaceAll('title="Informasi Tiket"', 'title="Ticket Information"')
      .replaceAll('title="Jam Operasional"', 'title="Opening Hours"')
      .replaceAll('title="Aksesibilitas"', 'title="Accessibility"')
      .replaceAll('title="Fasilitas"', 'title="Facilities"')
      .replaceAll('title="Destinasi Terdekat"', 'title="Nearby Destinations"')
      .replaceAll('title="Sumber"', 'title="Sources"');
  }
  return result;
}

function rewriteLinks(text, locale, slug) {
  const routeByTarget = Object.fromEntries(Object.keys(imageBySlug).map((target) => [target, target]));
  return text.replace(/href:\s*"\/en\/bali\/([^"]+)"/g, (_, target) => `href: "${routeByTarget[target] && target !== slug ? `/${locale}/bali/${routeByTarget[target]}` : '/destinasi'}"`);
}

function faqItems(source) {
  return [...source.matchAll(/"question":\s*"([^"]+)",\s*"answer":\s*"([^"]+)"/g)].map((match) => ({ question: match[1], answer: match[2] }));
}

await fs.rm(outputRoot, { recursive: true, force: true });
const registry = [];
const manifest = [];
const sourceFiles = (await Promise.all(sourceDirs.map(async (dir) => (await fs.readdir(dir)).filter((name) => name.endsWith('.mdx')).sort().map((name) => path.join(dir, name))))).flat();
for (const sourceFile of sourceFiles) {
  const rawContent = await fs.readFile(sourceFile, 'utf8');
  const { data, body } = parseFrontmatter(rawContent.replace(/\\u2014/g, '—').replace(/\\u2013/g, '–'));
  const ikhtisarMatch = body.match(/## Ikhtisar[\s\S]{1,5}Bahasa Indonesia/);
  const overviewMatch = body.match(/## Overview[\s\S]{1,5}English/);
  const beforeId = body.slice(0, ikhtisarMatch ? ikhtisarMatch.index : body.length);
  const idNarrative = ikhtisarMatch && overviewMatch ? body.slice(ikhtisarMatch.index, overviewMatch.index) : (ikhtisarMatch ? body.slice(ikhtisarMatch.index) : '');
  const operationalStart = Math.min(...['<Accessibility', '<Facilities', '<TicketInformation', '<OpeningHours', '<NearbyDestinations'].map((tag) => body.indexOf(tag)).filter((index) => index >= 0));
  const enNarrative = overviewMatch ? body.slice(overviewMatch.index, operationalStart === Infinity ? body.length : operationalStart) : '';
  const operations = ['Accessibility', 'Facilities', 'TicketInformation', 'OpeningHours', 'NearbyDestinations']
    .map((component) => body.match(new RegExp(`<${component}[\\s\\S]*?\\/>`))?.[0] || '')
    .filter(Boolean)
    .join('\n\n');
  const faqId = body.match(/<FAQ title="FAQ — Bahasa Indonesia"[\s\S]*?\/>/)?.[0] || '';
  const faqEn = body.match(/<FAQ title="FAQ — English"[\s\S]*?\/>/)?.[0] || '';
  const travelTips = idNarrative.match(/<TravelTips[\s\S]*?\/>/)?.[0] || '';
  const sourceList = body.match(/<SourceList[\s\S]*?\/>/)?.[0] || '';
  for (const locale of ['id', 'en']) {
    const localizedTitle = locale === 'id' ? data.name.split(' / ')[0] : data.name.split(' / ').at(-1);
    const phase4 = phase4Metadata[data.slug];
    const metaTitle = locale === 'id' ? (data.metaTitleId || phase4?.idTitle) : (data.metaTitleEn || phase4?.enTitle);
    const metaDescription = locale === 'id' ? (data.metaDescriptionId || phase4?.idDescription) : (data.metaDescriptionEn || phase4?.enDescription);
    const publicHeader = beforeId.replace(/<EditorialNotice[\s\S]*?<\/EditorialNotice>\s*/g, '').replace(/## Google Maps Information[\s\S]*$/, '');
    const suppliedMapsUrl = body.match(/"googleMapsSearchUrl"\s*:\s*"([^"]+)"/)?.[1];
    let suppliedMapsQuery;
    if (suppliedMapsUrl) {
      try {
        suppliedMapsQuery = new URL(suppliedMapsUrl).searchParams.get('query') || undefined;
      } catch {
        suppliedMapsQuery = undefined;
      }
    }
    const queryProp = suppliedMapsQuery ? ` query=${JSON.stringify(suppliedMapsQuery)}` : '';
    const map = `<DestinationMap name=${JSON.stringify(localizedTitle)} regency=${JSON.stringify(data.regency)} province=${JSON.stringify(data.province)} locale=${JSON.stringify(locale)}${queryProp} />`;
    const noticeAndHero = localizedCommon(publicHeader, locale, data).replace(/(<QuickFacts[\s\S]*?\/>)/, `$1\n\n${map}`);
    const ops = localizedCommon(operations, locale, data);
    const narrative = locale === 'id'
      ? localizedCommon(idNarrative, locale, data)
      : `${enNarrative}\n\n${travelTips.replace('title="Tips Kunjungan"', 'title="Travel Tips"')}\n\n`;
    const faq = locale === 'id' ? localizedCommon(faqId, locale, data) : faqEn;
    const content = rewriteLinks(`${noticeAndHero}${narrative}${ops}${faq}\n\n${localizedCommon(sourceList, locale, data)}`, locale, data.slug);
    const dir = path.join(outputRoot, locale, 'bali');
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, `${data.slug}.mdx`);
    await fs.writeFile(file, content);
    const index = registry.length;
    registry.push({ index, locale, slug: data.slug, relative: path.relative(path.join(repo, 'client/content'), file).replaceAll('\\', '/') });
    const categoryId = { 'beach': 'Pantai', 'coastal-viewpoint': 'Titik pandang pesisir', 'cultural-park': 'Taman budaya', 'Sea temple': 'Pura laut', 'Clifftop temple': 'Pura tepi tebing', 'Rice terrace': 'Terasering sawah', 'Wildlife and temple sanctuary': 'Suaka satwa dan pura', 'Holy spring temple': 'Pura mata air suci', 'Scenic walking trail': 'Jalur jalan kaki panorama', 'Archaeological and sacred site': 'Situs arkeologi dan suci', 'Rice-terrace cultural landscape': 'Lanskap budaya terasering', 'Lake temple': 'Pura danau', 'Waterfall and trekking destination': 'Destinasi air terjun dan trekking', 'Black-sand beach and dolphin-watching area': 'Pantai pasir hitam dan kawasan lumba-lumba', 'Highland village and nature base': 'Desa pegunungan dan basis wisata alam', 'Clifftop viewpoint and beach': 'Titik pandang tebing dan pantai', 'Natural coastal arch and cove': 'Lengkungan pantai dan teluk alami', 'Tidal rock pool and coastal formation': 'Kolam pasang dan formasi pesisir', 'Botanic garden and highland recreation': 'Kebun botani dan rekreasi dataran tinggi', 'Photography landmark': 'Landmark fotografi', 'Natural hot-spring bathing complex': 'Kompleks pemandian air panas alami', 'Buddhist monastery and meditation complex': 'Vihara Buddha dan kompleks meditasi' }[data.category] || data.category;
    manifest.push({ locale, slug: data.slug, name: localizedTitle, province: data.province, regency: data.regency, category: locale === 'id' ? categoryId : data.category, metaTitle, metaDescription, lastUpdated: data.lastUpdated, lastVerified: data.lastVerified, image: imageBySlug[data.slug], faq: faqItems(locale === 'id' ? localizedCommon(faqId, locale, data) : faqEn) });
  }
}

const imports = registry.map((item) => `import Page${item.index} from './${item.relative}';`).join('\n');
const entries = registry.map((item) => `  '${item.locale}/${item.slug}': Page${item.index},`).join('\n');
await fs.writeFile(path.join(repo, 'client/content/golden-registry.ts'), `${imports}\n\nimport type { ComponentType } from 'react';\nexport const goldenRegistry: Record<string, ComponentType> = {\n${entries}\n};\n`);
await fs.writeFile(path.join(repo, 'client/content/golden-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${registry.length} locale-specific golden reference pages.`);
