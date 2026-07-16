export const articles = [
  {
    slug: 'itinerary-bali-3-hari-untuk-pemula',
    cluster: 'Itinerary',
    title: 'Itinerary Bali 3 Hari untuk Kunjungan Pertama',
    description: 'Rute tiga hari yang realistis untuk mengenal Bali tanpa menghabiskan terlalu banyak waktu di perjalanan.',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readTime: '8 menit',
    sections: [
      ['Sebelum menyusun rute', 'Bali terlihat kecil di peta, tetapi waktu tempuh antarkawasan dapat berubah karena kepadatan lalu lintas. Untuk perjalanan singkat, pilih satu basis menginap dan kelompokkan tujuan berdasarkan wilayah. Rute ini memakai kawasan selatan sebagai titik awal agar hari pertama tidak terlalu melelahkan setelah penerbangan.'],
      ['Hari pertama: adaptasi di Bali Selatan', 'Gunakan hari kedatangan untuk menjelajahi pantai atau kawasan budaya yang dekat dengan penginapan. Hindari memasukkan terlalu banyak tempat. Sore hari cocok untuk berjalan santai, mencoba makanan lokal, lalu beristirahat lebih awal.'],
      ['Hari kedua: budaya dan lanskap Bali Tengah', 'Berangkat pagi menuju kawasan Ubud dan sekitarnya. Pilih dua atau tiga tujuan utama seperti pura, persawahan, atau jalur jalan kaki. Sisakan waktu untuk makan siang dan perjalanan kembali; jadwal yang longgar biasanya lebih menyenangkan daripada daftar panjang yang terburu-buru.'],
      ['Hari ketiga: satu pengalaman utama', 'Pilih salah satu: pantai selatan, pura di tebing, atau aktivitas belanja dan kuliner. Sesuaikan dengan jam penerbangan. Berangkat ke bandara lebih awal, terutama pada sore dan malam hari.'],
      ['Checklist praktis', 'Periksa cuaca, jam operasional, aturan pakaian di pura, serta harga tiket dari kanal resmi sebelum berangkat. Bawa air minum, pelindung matahari, dan uang elektronik maupun tunai dalam nominal secukupnya.']
    ]
  },
  {
    slug: 'panduan-budget-liburan-jawa-bali',
    cluster: 'Budget',
    title: 'Cara Menyusun Budget Liburan Jawa dan Bali',
    description: 'Kerangka anggaran perjalanan yang membantu menghitung transportasi, penginapan, makan, tiket, dan dana darurat.',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readTime: '7 menit',
    sections: [
      ['Mulai dari biaya yang paling sulit berubah', 'Catat transportasi antarkota dan penginapan terlebih dahulu. Dua komponen ini biasanya menentukan sebagian besar anggaran. Bandingkan harga total, bukan hanya tarif awal, karena bagasi, transportasi menuju terminal, dan pajak dapat menambah biaya.'],
      ['Buat anggaran harian', 'Pisahkan kebutuhan makan, transportasi lokal, tiket masuk, dan kebutuhan kecil. Gunakan batas harian yang realistis dan sisakan ruang untuk satu pengalaman prioritas. Dengan cara ini, pengeluaran spontan tidak langsung mengganggu seluruh rencana.'],
      ['Siapkan dana darurat', 'Simpan dana cadangan terpisah untuk perubahan jadwal, kebutuhan kesehatan, atau transportasi alternatif. Dana darurat tidak perlu dibelanjakan jika perjalanan berjalan sesuai rencana.'],
      ['Verifikasi harga', 'Harga tiket dan transportasi dapat berubah. Selalu cek situs pengelola, akun resmi, atau kanal pemesanan tepercaya menjelang keberangkatan. Hindari menjadikan angka dari artikel lama sebagai satu-satunya acuan.']
    ]
  },
  {
    slug: 'transportasi-antar-kota-di-jawa',
    cluster: 'Transportasi',
    title: 'Memilih Transportasi Antar Kota di Jawa',
    description: 'Perbandingan praktis kereta, bus, kendaraan sewa, dan penerbangan untuk menyusun perjalanan lintas kota di Jawa.',
    publishedAt: '2026-07-16',
    updatedAt: '2026-07-16',
    readTime: '7 menit',
    sections: [
      ['Kereta untuk koridor antarkota', 'Kereta cocok untuk banyak rute utama di Jawa karena jadwal dan titik keberangkatannya relatif mudah direncanakan. Pesan lebih awal pada akhir pekan panjang atau musim liburan dan periksa stasiun asal serta tujuan dengan teliti.'],
      ['Bus untuk jangkauan yang lebih luas', 'Bus dapat menjangkau kota yang tidak terhubung langsung dengan kereta. Waktu tiba lebih dipengaruhi kondisi jalan, sehingga jangan membuat sambungan perjalanan yang terlalu rapat.'],
      ['Kendaraan sewa untuk kelompok', 'Mobil sewa memberi fleksibilitas untuk tujuan di luar pusat kota dan dapat efisien untuk beberapa orang. Hitung biaya bahan bakar, tol, parkir, pengemudi, serta waktu istirahat.'],
      ['Pilih berdasarkan rute, bukan tren', 'Transportasi terbaik bergantung pada jumlah peserta, waktu yang tersedia, lokasi tujuan, dan toleransi terhadap perpindahan. Bandingkan perjalanan dari pintu ke pintu, bukan hanya durasi di kendaraan.']
    ]
  }
];

export function getArticle(slug) {
  return articles.find((article) => article.slug === slug);
}
