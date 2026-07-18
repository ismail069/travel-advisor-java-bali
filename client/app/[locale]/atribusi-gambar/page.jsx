import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Image Credits' : 'Atribusi Gambar',
    description: isEn ? 'Credits for visual creators.' : 'Penghargaan untuk pencipta visual.',
    alternates: { canonical: `/${locale}/atribusi-gambar` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Image Credits" description="Credits for visual creators.">
        <h2>Credits</h2><p>Images used on this site are open-licensed or have been used with permission.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Atribusi Gambar" description="Penghargaan untuk pencipta visual.">
      <h2>Kredit</h2><p>Gambar yang digunakan di situs ini berlisensi terbuka atau telah mendapat izin.</p>
    </LegalPage>
  );
}
