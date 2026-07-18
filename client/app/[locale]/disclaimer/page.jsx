import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Disclaimer' : 'Disclaimer',
    description: isEn ? 'Limitation of liability.' : 'Penafian tanggung jawab.',
    alternates: { canonical: `/${locale}/disclaimer` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Disclaimer" description="Limitation of liability.">
        <h2>Travel information</h2><p>Destination conditions, prices, access, operating hours, and policies are subject to change without notice. Always confirm information with management or official authorities.</p>
        <h2>AI Content</h2><p>TripAssistant helps generate ideas, not final decisions. Responses may be inaccurate, incomplete, or not reflect current conditions.</p>
        <h2>Advertising and links</h2><p>The site may display third-party ads or links. The presence of ads does not imply endorsement of every product. Editorial content is not determined by advertisers.</p>
        <h2>Safety</h2><p>Assess your physical capabilities, health conditions, weather, and location risks before engaging in activities. Follow staff instructions and local regulations.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Disclaimer" description="Penafian tanggung jawab.">
      <h2>Informasi perjalanan</h2><p>Kondisi destinasi, harga, akses, jam operasional, dan kebijakan dapat berubah tanpa pemberitahuan. Selalu konfirmasikan informasi kepada pengelola atau otoritas resmi.</p><h2>Konten AI</h2><p>TripAssistant membantu menghasilkan ide, bukan keputusan final. Respons dapat tidak akurat, tidak lengkap, atau tidak sesuai kondisi terbaru.</p><h2>Iklan dan tautan</h2><p>Situs dapat menampilkan iklan atau tautan pihak ketiga. Kehadiran iklan tidak berarti kami mendukung setiap produk. Konten editorial tidak ditentukan oleh pengiklan.</p><h2>Keselamatan</h2><p>Nilai kemampuan fisik, kondisi kesehatan, cuaca, dan risiko lokasi sebelum mengikuti aktivitas. Ikuti instruksi petugas serta peraturan setempat.</p>
    </LegalPage>
  );
}
