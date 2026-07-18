import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'About Us' : 'Tentang Kami',
    description: isEn ? 'Independent travel site managed personally by Ismail.' : 'Situs perjalanan independen yang dikelola secara personal oleh Ismail.',
    alternates: { canonical: `/${locale}/tentang` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="About Us" description="Independent travel site managed personally by Ismail.">
        <h2>Our Mission</h2><p>JawaBali Trip helps readers plan trips across Java and Bali through destination profiles, practical guides, and AI tools. Our focus is on clear, transparently sourced, and actionable information.</p><h2>About the manager</h2><p>Ismail is the owner, manager, writer, and primary editor of JawaBali Trip. This site does not represent tourism boards, governments, Google, or any specific destination management.</p><h2>How we work</h2><p>We use official or reputable sources as starting points, draft our own explanations, and highlight dynamic info that needs verification. Corrections can be sent via the Contact page.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Tentang Kami" description="Situs perjalanan independen yang dikelola secara personal oleh Ismail.">
      <h2>Misi kami</h2><p>JawaBali Trip membantu pembaca merencanakan perjalanan di Jawa dan Bali melalui profil destinasi, panduan praktis, dan alat bantu AI. Fokus kami adalah informasi yang mudah dipahami, transparan tentang sumbernya, dan berguna untuk mengambil keputusan.</p><h2>Tentang pengelola</h2><p>Ismail adalah pemilik, pengelola, penulis, dan editor utama JawaBali Trip. Situs ini tidak mewakili badan pariwisata, pemerintah, Google, atau pengelola destinasi tertentu.</p><h2>Cara kami bekerja</h2><p>Kami menggunakan sumber resmi atau bereputasi sebagai titik awal, menyusun penjelasan secara mandiri, serta menandai informasi yang perlu diverifikasi karena dapat berubah. Koreksi dapat dikirim melalui halaman Kontak.</p>
    </LegalPage>
  );
}
