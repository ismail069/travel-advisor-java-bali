import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { notFound } from 'next/navigation';
import DocsShell from '@/components/docs/DocsShell';
import { docsRegistry } from '@/content/docs-registry';
import { adjacentDocs, docsNavigation, getAllDocs, getDoc } from '@/lib/docs';

type PageProps = { params: Promise<{ slug?: string[] }> };

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: 'Dokumentasi tidak ditemukan', robots: { index: false } };
  const canonical = slug.length ? `/docs/${slug.join('/')}` : '/docs';
  return { title: doc.meta.title, description: doc.meta.description, alternates: { canonical }, openGraph: { type: 'article', title: doc.meta.title, description: doc.meta.description, url: canonical } };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  const href = slug.length ? `/docs/${slug.join('/')}` : '/docs';
  const Content = docsRegistry[href];
  if (!Content) notFound();
  const adjacent = adjacentDocs(href);
  const crumbs = slug.length ? [{ title: 'Docs', href: '/docs' }, { title: doc.meta.title, href }] : [{ title: 'Docs', href: '/docs' }];
  return <DocsShell navigation={docsNavigation.items} docs={getAllDocs()} toc={doc.toc}>
    <div className="mb-9 flex items-center gap-2 text-sm text-slate-500" aria-label="Breadcrumb">{crumbs.map((crumb, index)=><span key={`${crumb.href}-${index}`} className="flex min-w-0 items-center gap-2">{index > 0 && <span aria-hidden="true">/</span>}{index === crumbs.length - 1 ? <span className="truncate font-bold text-slate-700">{crumb.title}</span> : <Link href={crumb.href} className="capitalize hover:text-primary">{crumb.title}</Link>}</span>)}</div>
    {slug.length === 0 && <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-primary"><BookOpen size={15}/> Phase 1 · Source of truth</div>}
    <article className="docs-prose space-y-6"><Content /></article>
    <nav className="mt-14 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2" aria-label="Dokumentasi sebelumnya dan berikutnya">
      <div>{adjacent.previous?.href && <Link href={adjacent.previous.href} className="group block rounded-2xl border border-slate-200 bg-white p-5 hover:border-primary"><span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400"><ArrowLeft size={14}/> Sebelumnya</span><span className="mt-2 block font-black group-hover:text-primary">{adjacent.previous.title}</span></Link>}</div>
      <div>{adjacent.next?.href && <Link href={adjacent.next.href} className="group block rounded-2xl border border-slate-200 bg-white p-5 text-right hover:border-primary"><span className="flex items-center justify-end gap-2 text-xs font-black uppercase tracking-wider text-slate-400">Berikutnya <ArrowRight size={14}/></span><span className="mt-2 block font-black group-hover:text-primary">{adjacent.next.title}</span></Link>}</div>
    </nav>
  </DocsShell>;
}
