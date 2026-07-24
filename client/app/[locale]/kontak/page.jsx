import LegalPage from '@/components/LegalPage';
import { CONTACT_EMAIL } from '@/lib/site';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Contact' : 'Kontak',
    description: isEn ? 'Get in touch with us.' : 'Hubungi kami.',
    alternates: { canonical: `/${locale}/kontak` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Contact" description="Get in touch with us.">
        <h2>Email</h2><p><a className="font-bold text-primary" href={`mailto:${CONTACT_EMAIL}`}>{`${CONTACT_EMAIL}`}</a></p>
        <h2>Information correction</h2><p>Include the page URL, the section that needs correction, a brief explanation, and supporting sources. We will review the input before making changes.</p>
        <h2>Response time</h2><p>This site is managed personally. We strive to respond to relevant messages within a reasonable time, but do not guarantee immediate responses.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Kontak" description="Hubungi kami.">
      <h2>Email</h2><p><a className="font-bold text-primary" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p><h2>Koreksi informasi</h2><p>Sertakan URL halaman, bagian yang perlu diperbaiki, penjelasan singkat, dan sumber pendukung. Kami akan meninjau masukan sebelum melakukan perubahan.</p><h2>Waktu tanggapan</h2><p>Situs ini dikelola secara personal. Kami berusaha menanggapi pesan yang relevan dalam waktu yang wajar, tetapi tidak menjamin respons langsung.</p>
    </LegalPage>
  );
}
