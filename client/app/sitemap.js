import { articles } from '@/content/articles';
import { getDestinations } from '@/lib/api';
import { destinationSlug, SITE_URL } from '@/lib/site';

export default async function sitemap(){
 const destinations=await getDestinations(); const now=new Date();
 const pages=['','/destinasi','/panduan','/tentang','/kontak','/kebijakan-privasi','/kebijakan-cookie','/ketentuan','/disclaimer','/kebijakan-editorial'];
 return [...pages.map((path,index)=>({url:`${SITE_URL}${path}`,lastModified:now,changeFrequency:index<3?'weekly':'yearly',priority:index===0?1:index<3?.9:.4})),...destinations.map((d)=>({url:`${SITE_URL}/destinasi/${destinationSlug(d)}`,lastModified:d.created_at?new Date(d.created_at):now,changeFrequency:'monthly',priority:.8})),...articles.map((a)=>({url:`${SITE_URL}/panduan/${a.slug}`,lastModified:new Date(a.updatedAt),changeFrequency:'monthly',priority:.8}))];
}
