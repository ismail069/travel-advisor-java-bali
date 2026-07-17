import navigationData from '@/content/docs-navigation.json';
import docsContentData from '@/content/docs-content.json';

export type DocMeta = { title: string; description: string; href: string; slug: string[]; searchText: string };
export type NavigationItem = { title: string; href?: string; children?: NavigationItem[] };
export type TocItem = { id: string; title: string; level: number };
type Doc = { content: string; meta: { title: string; description: string }; toc: TocItem[] };

export const docsNavigation = navigationData as { title: string; items: NavigationItem[] };
const docsContent = docsContentData as Record<string, Doc>;

export function flattenNavigation(items: NavigationItem[] = docsNavigation.items): NavigationItem[] {
  return items.flatMap((item) => item.href ? [item] : flattenNavigation(item.children || []));
}

export function getDoc(slug: string[]) {
  const href = slug.length ? `/docs/${slug.join('/')}` : '/docs';
  return docsContent[href] || null;
}

export function getAllDocs(): DocMeta[] {
  return flattenNavigation().map((item) => {
    const slug = item.href === '/docs' ? [] : item.href!.replace(/^\/docs\/?/, '').split('/').filter(Boolean);
    const doc = getDoc(slug);
    return { title: doc?.meta.title || item.title, description: doc?.meta.description || '', href: item.href!, slug, searchText: (doc?.content || '').replace(/[`#*_>\[\]()|-]/g, ' ') };
  });
}

export function headingId(title: string) {
  return title.toLowerCase().replace(/[`*_]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

export function adjacentDocs(href: string) {
  const all = flattenNavigation();
  const index = all.findIndex((item) => item.href === href);
  return { previous: index > 0 ? all[index - 1] : null, next: index >= 0 && index < all.length - 1 ? all[index + 1] : null };
}
