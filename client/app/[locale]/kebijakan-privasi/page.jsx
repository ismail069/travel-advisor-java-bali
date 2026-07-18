import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Privacy Policy' : 'Kebijakan Privasi',
    description: isEn ? 'How we handle your data.' : 'Bagaimana kami menangani data Anda.',
    alternates: { canonical: `/${locale}/kebijakan-privasi` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Privacy Policy" description="How we handle your data.">
        <h2>Data that may be processed</h2><p>We may process the traveler name you enter, language and theme preferences, conversations with TripAssistant, reviews, basic technical data, and usage data if analytics services are enabled.</p>
        <h2>Purpose of processing</h2><p>Data is used to run features, remember preferences, improve content quality, prevent abuse, and understand site performance. Do not enter sensitive information into the chatbot or reviews.</p>
        <h2>Service providers</h2><p>The site may use Vercel for hosting, Supabase for data storage, Google Gemini for AI request processing, and Google AdSense or analytics services once enabled. Each provider may process data according to their policies.</p>
        <h2>Retention and user choices</h2><p>Local data can be deleted via browser settings. Requests regarding stored data can be sent to <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-primary">{`${CONTACT_EMAIL}`}</a>. We may request additional information to verify requests.</p>
        <h2>Policy changes</h2><p>This policy may be updated when features or service providers change. The update date is displayed at the top of the page.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Kebijakan Privasi" description="Bagaimana kami menangani data Anda.">
      <h2>Data yang dapat diproses</h2><p>Kami dapat memproses nama traveler yang Anda masukkan, preferensi bahasa dan tema, percakapan dengan TripAssistant, ulasan, data teknis dasar, serta data penggunaan apabila layanan analitik diaktifkan.</p><h2>Tujuan pemrosesan</h2><p>Data digunakan untuk menjalankan fitur, mengingat preferensi, meningkatkan kualitas konten, mencegah penyalahgunaan, serta memahami performa situs. Jangan memasukkan informasi sensitif ke dalam chatbot atau ulasan.</p><h2>Penyedia layanan</h2><p>Situs dapat menggunakan Vercel untuk hosting, Supabase untuk penyimpanan data, Google Gemini untuk pemrosesan permintaan AI, serta Google AdSense atau layanan analitik setelah diaktifkan. Masing-masing penyedia dapat memproses data sesuai kebijakannya.</p><h2>Retensi dan pilihan pengguna</h2><p>Data lokal dapat dihapus melalui pengaturan browser. Permintaan terkait data yang tersimpan dapat dikirim ke <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-primary">{CONTACT_EMAIL}</a>. Kami dapat meminta informasi tambahan untuk memverifikasi permintaan.</p><h2>Perubahan kebijakan</h2><p>Kebijakan ini dapat diperbarui ketika fitur atau penyedia layanan berubah. Tanggal pembaruan ditampilkan di bagian atas halaman.</p>
    </LegalPage>
  );
}
