import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { headingId } from '@/lib/docs';
import CopyCodeButton from './CopyCodeButton';
import { destinationMdxComponents } from '@/components/destination/mdx-components';

function textOf(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') return String(children);
  if (Array.isArray(children)) return children.map(textOf).join('');
  if (children && typeof children === 'object' && 'props' in children) return textOf((children as { props: { children?: ReactNode } }).props.children);
  return '';
}

export const mdxComponents = {
  ...destinationMdxComponents,
  h1: (props: ComponentPropsWithoutRef<'h1'>) => <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl" {...props}/>,
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => <h2 id={headingId(textOf(children))} className="scroll-mt-28 border-t border-slate-200 pt-9 text-2xl font-black tracking-tight text-slate-950 first:border-0" {...props}>{children}</h2>,
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => <h3 id={headingId(textOf(children))} className="scroll-mt-28 text-lg font-black text-slate-900" {...props}>{children}</h3>,
  p: (props: ComponentPropsWithoutRef<'p'>) => <p className="leading-8 text-slate-700" {...props}/>,
  ul: (props: ComponentPropsWithoutRef<'ul'>) => <ul className="ml-5 list-disc space-y-2 leading-7 text-slate-700 marker:text-primary" {...props}/>,
  ol: (props: ComponentPropsWithoutRef<'ol'>) => <ol className="ml-5 list-decimal space-y-2 leading-7 text-slate-700 marker:font-bold marker:text-primary" {...props}/>,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => <blockquote className="rounded-2xl border-l-4 border-primary bg-primary/5 px-5 py-4 text-slate-700" {...props}/>,
  a: (props: ComponentPropsWithoutRef<'a'>) => <a className="font-bold text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary" {...props}/>,
  table: (props: ComponentPropsWithoutRef<'table'>) => <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full border-collapse text-left text-sm" {...props}/></div>,
  th: (props: ComponentPropsWithoutRef<'th'>) => <th className="border-b border-slate-200 bg-slate-100 px-4 py-3 font-black" {...props}/>,
  td: (props: ComponentPropsWithoutRef<'td'>) => <td className="border-b border-slate-100 px-4 py-3 text-slate-700" {...props}/>,
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => { const value = textOf(children).trimEnd(); return <div className="relative"><pre className="overflow-x-auto rounded-2xl bg-slate-950 p-5 pr-20 text-sm leading-7 text-slate-100" {...props}>{children}</pre><CopyCodeButton value={value}/></div>; },
  code: (props: ComponentPropsWithoutRef<'code'>) => <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-bold text-fuchsia-800" {...props}/>,
};
