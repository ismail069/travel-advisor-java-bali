import Breadcrumbs from '@/components/Breadcrumbs';
import DestinationExplorer from '@/components/DestinationExplorer';
import { getDestinations } from '@/lib/api';

export const metadata = { title: 'Destinasi Wisata Jawa dan Bali', description: 'Jelajahi pilihan destinasi wisata di Jawa dan Bali berdasarkan kota, pulau, dan kategori.', alternates: { canonical: '/destinasi' } };

export default async function DestinationsPage() {
  const destinations = await getDestinations();
  return <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><Breadcrumbs items={[{name:'Beranda',href:'/'},{name:'Destinasi',href:'/destinasi'}]} /><header className="mb-8 max-w-3xl"><p className="font-black uppercase tracking-wider text-primary">Jelajahi Indonesia</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Destinasi Jawa dan Bali</h1><p className="mt-4 text-lg leading-8 text-slate-600">Temukan inspirasi perjalanan berdasarkan wilayah dan karakter tempat. Verifikasi harga, jam buka, serta kondisi terbaru melalui sumber resmi sebelum berangkat.</p></header><DestinationExplorer destinations={destinations} /></div>;
}
