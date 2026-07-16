import Link from 'next/link';
import JsonLd from './JsonLd';
import { absoluteUrl } from '@/lib/site';

export default function Breadcrumbs({ items }) {
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: absoluteUrl(item.href) })) };
  return <><JsonLd data={schema} /><nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap gap-2 text-sm text-slate-500">{items.map((item, index) => <span key={item.href} className="flex gap-2">{index > 0 && <span aria-hidden="true">/</span>}{index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.href} className="hover:text-primary">{item.name}</Link>}</span>)}</nav></>;
}
