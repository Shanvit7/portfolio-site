import type { MDXComponents } from 'mdx/types'
import { ComponentPropsWithoutRef } from 'react'
import { highlight } from 'sugar-high'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Cover: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure>
          <img src={src} alt={alt} className="rounded-xl" />
          <figcaption className="text-center">{caption}</figcaption>
        </figure>
      )
    },
    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      const codeHTML = highlight(children as string)
      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },
    table: ({ children, ...props }: ComponentPropsWithoutRef<'table'>) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: ComponentPropsWithoutRef<'thead'>) => (
      <thead
        className="border-b border-zinc-200 dark:border-zinc-700"
        {...props}
      >
        {children}
      </thead>
    ),
    th: ({ children, ...props }: ComponentPropsWithoutRef<'th'>) => (
      <th
        className="px-4 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: ComponentPropsWithoutRef<'td'>) => (
      <td
        className="border-b border-zinc-100 px-4 py-2 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
        {...props}
      >
        {children}
      </td>
    ),
  }
}
