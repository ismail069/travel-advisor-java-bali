import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Cookie Policy' : 'Kebijakan Cookie',
    description: isEn ? 'Cookie usage on this site.' : 'Penggunaan cookie di situs ini.',
    alternates: { canonical: `/${locale}/kebijakan-cookie` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Cookie Policy" description="Cookie usage on this site.">
        <h2>Functional cookies</h2><p>Cookies and local storage may be used to remember traveler names, device identity, language, themes, and consent status. This data supports the features you choose and is not used to sell personal identity.</p>
        <h2>Analytics and advertising</h2><p>If analytics or Google AdSense is enabled, these providers may use cookies for measurement, security, personalization, or ad serving according to your consent choices and applicable regulations.</p>
        <h2>Managing choices</h2><p>You can reject non-essential cookies through the consent banner when available, and delete cookies through browser settings. Some personalization features may not function after data is deleted.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Kebijakan Cookie" description="Penggunaan cookie di situs ini.">
      <h2>Cookie fungsional</h2><p>Cookie dan local storage dapat digunakan untuk mengingat nama traveler, identitas perangkat, bahasa, tema, serta status persetujuan. Data ini mendukung fitur yang Anda pilih dan bukan digunakan untuk menjual identitas pribadi.</p><h2>Analitik dan periklanan</h2><p>Apabila analitik atau Google AdSense diaktifkan, penyedia tersebut dapat menggunakan cookie untuk pengukuran, keamanan, personalisasi, atau penayangan iklan sesuai pilihan persetujuan dan peraturan yang berlaku.</p><h2>Mengelola pilihan</h2><p>Anda dapat menolak cookie non-esensial melalui banner persetujuan ketika tersedia, serta menghapus cookie melalui pengaturan browser. Beberapa fitur personalisasi mungkin tidak berfungsi setelah data dihapus.</p>
    </LegalPage>
  );
}
