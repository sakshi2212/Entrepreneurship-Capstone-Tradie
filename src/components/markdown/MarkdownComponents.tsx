import { Components } from "react-markdown";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
type ParagraphProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>;
type ListProps = DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
type OrderedListProps = DetailedHTMLProps<HTMLAttributes<HTMLOListElement>, HTMLOListElement>;
type ListItemProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>;
type BlockquoteProps = DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>;
type LinkProps = DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & { href?: string };
type CodeProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { inline?: boolean };

export const MarkdownComponents: Components = {
  h1: ({ children, ...props }: HeadingProps) => (
    <h1 {...props} className="text-2xl font-bold mb-4 text-primary/90 tracking-tight">{children}</h1>
  ),

  h2: ({ children, ...props }: HeadingProps) => (
    <h2 {...props} className="text-xl font-semibold mb-3 text-primary/90 tracking-tight">{children}</h2>
  ),

  h3: ({ children, ...props }: HeadingProps) => (
    <h3 {...props} className="text-lg font-medium mb-2 text-primary/80 tracking-tight">{children}</h3>
  ),

  p: ({ children, ...props }: ParagraphProps) => (
    <p {...props} className="mb-3 leading-7 text-foreground/90">{children}</p>
  ),

  ul: ({ children, ...props }: ListProps) => (
    <ul {...props} className="list-disc ml-5 mb-4 space-y-1.5 text-foreground/90">{children}</ul>
  ),

  ol: ({ children, ...props }: OrderedListProps) => (
    <ol {...props} className="list-decimal ml-5 mb-4 space-y-1.5 text-foreground/90">{children}</ol>
  ),

  li: ({ children, ...props }: ListItemProps) => (
    <li {...props} className="text-foreground/90 leading-7">{children}</li>
  ),

  code: ({ inline, children, ...props }: CodeProps) => {
    if (inline) {
      return (
        <code {...props} className="bg-muted/60 px-1.5 py-0.5 rounded font-mono text-sm text-primary">
          {children}
        </code>
      );
    }
    return (
      <pre className="bg-muted/60 p-4 rounded-lg overflow-x-auto mb-4 border border-border/20">
        <code {...props} className="font-mono text-sm text-primary">{children}</code>
      </pre>
    );
  },

  blockquote: ({ children, ...props }: BlockquoteProps) => (
    <blockquote {...props} className="border-l-4 border-primary/30 pl-4 my-4 text-foreground/80 italic">
      {children}
    </blockquote>
  ),

  a: ({ href, children, ...props }: LinkProps) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/90 hover:underline decoration-primary/30 decoration-2 underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </a>
  ),

  strong: ({ children }) => (
    <strong className="font-semibold text-primary/90">{children}</strong>
  ),

  em: ({ children }) => (
    <em className="italic text-foreground/90">{children}</em>
  ),

  hr: () => (
    <hr className="border-t border-border/20 my-6" />
  ),
};