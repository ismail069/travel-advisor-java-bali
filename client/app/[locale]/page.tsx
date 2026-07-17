import { notFound, redirect } from 'next/navigation';

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale === 'en') redirect('/en/bali');
  if (locale === 'id') redirect('/');
  notFound();
}
