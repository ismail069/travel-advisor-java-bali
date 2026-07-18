import TripAssistant from '@/components/TripAssistant';
import Breadcrumbs from '@/components/Breadcrumbs';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: 'TripAssistant AI',
    description: isEn ? 'AI assistant to help plan your trips in Java and Bali.' : 'Asisten AI untuk membantu menyusun ide perjalanan Jawa dan Bali.',
    alternates: { canonical: `/${locale}/trip-assistant` },
    robots: { index: false, follow: true }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';

  const homeLabel = isEn ? 'Home' : 'Beranda';
  const headerTitle = 'TripAssistant AI';
  const headerDesc = isEn 
    ? 'Use as an idea generation tool. Always verify prices, schedules, weather, and safety through official sources.'
    : 'Gunakan sebagai alat bantu ide. Selalu verifikasi harga, jadwal, cuaca, dan keselamatan melalui sumber resmi.';
  const footerNote = isEn
    ? 'Do not send sensitive data. AI answers may contain errors and are not professional advice.'
    : 'Jangan kirim data sensitif. Jawaban AI dapat mengandung kekeliruan dan bukan nasihat profesional.';

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: homeLabel, href: isEn ? '/en' : '/' }, { name: 'TripAssistant AI', href: `/${locale}/trip-assistant` }]} />
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">{headerTitle}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{headerDesc}</p>
      </header>
      <TripAssistant locale={locale} />
      <p className="mt-5 text-xs leading-5 text-slate-500">{footerNote}</p>
    </div>
  );
}
