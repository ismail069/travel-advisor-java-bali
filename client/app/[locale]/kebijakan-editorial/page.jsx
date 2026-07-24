import LegalPage from '@/components/LegalPage';

export async function generateMetadata({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  return {
    title: isEn ? 'Editorial Policy' : 'Kebijakan Editorial',
    description: isEn ? 'Our writing standards.' : 'Standar penulisan kami.',
    alternates: { canonical: `/${locale}/kebijakan-editorial` }
  };
}

export default async function Page({ params }) {
  const locale = (await params).locale;
  const isEn = locale === 'en';
  
  if (isEn) {
    return (
      <LegalPage title="Editorial Policy" description="Our writing standards.">
        <h2>Editorial principles</h2><p>We prioritize clarity, usefulness, transparency, and independence. Articles are created to answer reader needs, not just chase page volume or keywords.</p>
        <h2>Sources and verification</h2><p>Factual information is prioritized from destination management, government, transport operators, or reputable sources. Highly volatile information is marked with reminders to re-verify.</p>
        <h2>AI Usage</h2><p>AI can assist in initial research, structuring, and language checking. JawaBali Trip Team is responsible for reviewing, editing, and deciding on publication. Content is not published automatically without human review.</p>
        <h2>Corrections</h2><p>Material errors are corrected after verification. The update date is displayed on the article. Readers can send corrections via the Contact page.</p>
        <h2>Independence and monetization</h2><p>Ads, affiliations, or commercial collaborations will be clearly labeled and do not buy positive reviews. Editorial and commercial separation is maintained.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Kebijakan Editorial" description="Standar penulisan kami.">
      <h2>Prinsip editorial</h2><p>Kami mengutamakan kejelasan, kegunaan, transparansi, dan independensi. Artikel dibuat untuk menjawab kebutuhan pembaca, bukan sekadar mengejar volume halaman atau kata kunci.</p><h2>Sumber dan verifikasi</h2><p>Informasi faktual diprioritaskan dari pengelola destinasi, pemerintah, operator transportasi, atau sumber bereputasi. Informasi yang mudah berubah diberi pengingat untuk diverifikasi kembali.</p><h2>Penggunaan AI</h2><p>AI dapat membantu riset awal, penyusunan struktur, dan pemeriksaan bahasa. JawaBali Trip Team bertanggung jawab meninjau, menyunting, dan memutuskan publikasi. Konten tidak diterbitkan otomatis tanpa peninjauan manusia.</p><h2>Koreksi</h2><p>Kesalahan material diperbaiki setelah diverifikasi. Tanggal pembaruan ditampilkan pada artikel. Pembaca dapat mengirim koreksi melalui halaman Kontak.</p><h2>Independensi dan monetisasi</h2><p>Iklan, afiliasi, atau kerja sama komersial akan diberi label yang jelas dan tidak membeli penilaian positif. Pemisahan editorial dan komersial dipertahankan.</p>
    </LegalPage>
  );
}
