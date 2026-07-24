import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import { articles, getArticle } from '@/content/articles';
import { absoluteUrl, OWNER_NAME } from '@/lib/site';

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }) { const {slug}=await params; const article=getArticle(slug); if(!article)return{}; return {title:article.title,description:article.description,alternates:{canonical:`/panduan/${slug}`},openGraph:{type:'article',title:article.title,description:article.description,url:`/panduan/${slug}`,publishedTime:article.publishedAt,modifiedTime:article.updatedAt,authors:[OWNER_NAME]}}; }

export default async function GuideArticle({ params }) {
  const { slug } = await params; const article = getArticle(slug); if (!article) notFound();
  const schema={'@context':'https://schema.org','@type':'Article',headline:article.title,description:article.description,datePublished:article.publishedAt,dateModified:article.updatedAt,author:{'@type':'Person',name:OWNER_NAME,url:absoluteUrl('/tentang')},publisher:{'@type':'Organization',name:'JawaBali Trip'},mainEntityOfPage:absoluteUrl(`/panduan/${slug}`),inLanguage:'id-ID'};
  return <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><JsonLd data={schema}/><Breadcrumbs items={[{name:'Beranda',href:'/'},{name:'Panduan',href:'/panduan'},{name:article.title,href:`/panduan/${slug}`}]} /><header><span className="text-sm font-black uppercase tracking-wider text-primary">{article.cluster}</span><h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-6xl">{article.title}</h1><p className="mt-6 text-xl leading-8 text-slate-600">{article.description}</p><div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500"><span>Oleh <Link href="/tentang" rel="author" className="font-bold text-slate-700">JawaBali Trip Team</Link></span><span>·</span><time dateTime={article.updatedAt}>Diperbarui {new Intl.DateTimeFormat('id-ID',{dateStyle:'long'}).format(new Date(article.updatedAt))}</time><span>·</span><span>{article.readTime}</span></div></header><div className="content-copy mt-12 border-t border-slate-200 pt-2">{article.sections.map(([title,body])=><section key={title}><h2>{title}</h2><p>{body}</p></section>)}</div><aside className="mt-12 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm leading-6 text-amber-950"><strong>Catatan editorial:</strong> Jadwal, tarif, dan kebijakan perjalanan dapat berubah. Gunakan panduan ini untuk perencanaan awal dan konfirmasikan informasi terbaru kepada operator atau pengelola resmi.</aside></article>;
}
