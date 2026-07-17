import Breadcrumbs from '@/components/Breadcrumbs';
import attributions from '@/content/destination-enhancements.json';
import goldenAttributions from '@/content/golden-image-attributions.json';

export const metadata = {
  title: 'Atribusi Gambar',
  description: 'Sumber, pencipta, lisensi, dan perubahan gambar yang digunakan JawaBali Trip.',
  alternates: { canonical: '/atribusi-gambar' }
};

export default function ImageAttributionPage() {
  const images = [...attributions.map((item) => item.image_attribution), ...goldenAttributions].filter((image, index, all) => image && all.findIndex((candidate) => candidate?.localPath === image.localPath) === index);
  return <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <Breadcrumbs items={[{ name: 'Beranda', href: '/' }, { name: 'Atribusi gambar', href: '/atribusi-gambar' }]} />
    <header className="max-w-3xl"><h1 className="text-4xl font-black tracking-tight sm:text-5xl">Atribusi gambar</h1><p className="mt-4 text-lg leading-8 text-slate-600">Foto berikut berasal dari Wikimedia Commons dan digunakan sesuai lisensi pada halaman masing-masing. Perubahan mekanis berupa pemotongan rasio, pengubahan ukuran, dan konversi WebP telah dilakukan.</p></header>
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      {images.map((image) => <article key={image.localPath} className="rounded-2xl border border-slate-200 bg-white p-5"><img src={image.localPath} alt={(image.slug || image.fileName || 'foto destinasi').replaceAll('-', ' ')} width="1200" height="800" loading="lazy" className="aspect-[3/2] w-full rounded-xl object-cover" /><h2 className="mt-4 font-black">{image.commonsTitle.replace(/^File:/, '')}</h2><dl className="mt-3 space-y-2 text-sm text-slate-600"><div><dt className="inline font-bold">Pencipta: </dt><dd className="inline">{image.artist}</dd></div><div><dt className="inline font-bold">Lisensi: </dt><dd className="inline"><a href={image.licenseUrl || image.sourcePage} target="_blank" rel="noreferrer" className="text-primary underline">{image.license}</a></dd></div><div><dt className="inline font-bold">Sumber: </dt><dd className="inline"><a href={image.sourcePage} target="_blank" rel="noreferrer" className="text-primary underline">Wikimedia Commons</a></dd></div><div><dt className="inline font-bold">Perubahan: </dt><dd className="inline">{image.changes || 'Dipotong, diubah ukurannya, dan dikonversi ke WebP.'}</dd></div></dl></article>)}
    </div>
  </div>;
}
