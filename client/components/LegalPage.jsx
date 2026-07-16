import Breadcrumbs from './Breadcrumbs';

export default function LegalPage({ title, description, updated='16 Juli 2026', children }) {
  return <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6"><Breadcrumbs items={[{name:'Beranda',href:'/'},{name:title,href:'#'}]} /><header><h1 className="text-4xl font-black tracking-tight sm:text-5xl">{title}</h1><p className="mt-4 text-lg leading-8 text-slate-600">{description}</p><p className="mt-4 text-sm text-slate-500">Terakhir diperbarui: {updated}</p></header><div className="content-copy mt-10">{children}</div></article>;
}
