import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Terms of Use' : 'Ketentuan Penggunaan',
    description: isEn ? 'Terms and conditions.' : 'Syarat dan ketentuan.',
    alternates: { canonical: `/${locale}/ketentuan` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Terms of Use" description="Terms and conditions.">
        <h2>Information usage</h2><p>Content is provided for initial information and planning. You are responsible for verifying prices, schedules, weather, safety, permits, and management rules before traveling.</p>
        <h2>TripAssistant AI</h2><p>AI answers may contain errors and are not a substitute for information from authorities, medical professionals, legal advisors, or travel providers. Do not send sensitive personal data.</p>
        <h2>User conduct</h2><p>Users must not send spam, unlawful content, hate speech, others' personal data, or attempt to disrupt systems and APIs.</p>
        <h2>Content rights</h2><p>JawaBali Trip editorial text may not be copied or republished substantially without permission. Trademarks, photos, and third-party sources remain the property of their respective rights holders.</p>
        <h2>Limitation of liability</h2><p>We do not guarantee all information is always complete or up to date and are not responsible for losses resulting from travel decisions made without independent verification.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Ketentuan Penggunaan" description="Syarat dan ketentuan.">
      <h2>Penggunaan informasi</h2><p>Konten disediakan untuk informasi dan perencanaan awal. Anda bertanggung jawab memverifikasi harga, jadwal, cuaca, keselamatan, izin, dan aturan pengelola sebelum melakukan perjalanan.</p><h2>TripAssistant AI</h2><p>Jawaban AI dapat mengandung kekeliruan dan bukan pengganti informasi dari otoritas, tenaga medis, penasihat hukum, atau penyedia perjalanan. Jangan mengirim data pribadi sensitif.</p><h2>Perilaku pengguna</h2><p>Pengguna tidak boleh mengirim spam, konten melanggar hukum, ujaran kebencian, data pribadi orang lain, atau mencoba mengganggu sistem dan API.</p><h2>Hak atas konten</h2><p>Teks editorial JawaBali Trip tidak boleh disalin atau diterbitkan ulang secara substansial tanpa izin. Merek, foto, dan sumber pihak ketiga tetap menjadi milik pemegang hak masing-masing.</p><h2>Batas tanggung jawab</h2><p>Kami tidak menjamin seluruh informasi selalu lengkap atau mutakhir dan tidak bertanggung jawab atas kerugian akibat keputusan perjalanan yang dibuat tanpa verifikasi independen.</p>
    </LegalPage>
  );
}
