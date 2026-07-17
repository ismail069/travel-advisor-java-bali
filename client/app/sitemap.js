import { articles } from '@/content/articles';
import { getDestinations } from '@/lib/api';
import { destinationSlug, SITE_URL } from '@/lib/site';
import docsNavigation from '@/content/docs-navigation.json';
import goldenManifest from '@/content/golden-manifest.json';

function flattenDocs(items) { return items.flatMap((item) => item.href ? [item] : flattenDocs(item.children || [])); }

export default async function sitemap(){
 const destinations=await getDestinations(); const now=new Date();
 const pages=['','/destinasi','/panduan','/tentang','/kontak','/kebijakan-privasi','/kebijakan-cookie','/ketentuan','/disclaimer','/kebijakan-editorial','/atribusi-gambar'];
 return [...pages.map((path,index)=>({url:`${SITE_URL}${path}`,lastModified:now,changeFrequency:index<3?'weekly':'yearly',priority:index===0?1:index<3?.9:.4})),...['id','en'].map((locale)=>({url:`${SITE_URL}/${locale}/bali`,lastModified:now,changeFrequency:'monthly',priority:.8})),...goldenManifest.map((item)=>({url:`${SITE_URL}/${item.locale}/bali/${item.slug}`,lastModified:new Date(item.lastUpdated),changeFrequency:'monthly',priority:.9})),...flattenDocs(docsNavigation.items).map((doc)=>({url:`${SITE_URL}${doc.href}`,lastModified:now,changeFrequency:'monthly',priority:.5})),...destinations.map((d)=>({url:`${SITE_URL}/destinasi/${destinationSlug(d)}`,lastModified:d.created_at?new Date(d.created_at):now,changeFrequency:'monthly',priority:.8})),...articles.map((a)=>({url:`${SITE_URL}/panduan/${a.slug}`,lastModified:new Date(a.updatedAt),changeFrequency:'monthly',priority:.8}))];
}
