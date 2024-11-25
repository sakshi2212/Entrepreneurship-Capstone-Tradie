import React from "react";

interface MarkdownProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
}

export const MarkdownComponents = {
  h1: (props: MarkdownProps) => (
    <h1 className="text-2xl font-bold mt-4 mb-2 text-primary">{props.children}</h1>
  ),
  h2: (props: MarkdownProps) => (
    <h2 className="text-xl font-bold mt-3 mb-2 text-primary/90">{props.children}</h2>
  ),
  h3: (props: MarkdownProps) => (
    <h3 className="text-lg font-bold mt-3 mb-2 text-primary/80">{props.children}</h3>
  ),
  p: (props: MarkdownProps) => (
    <p className="mb-2 leading-relaxed">{props.children}</p>
  ),
  ul: (props: MarkdownProps) => (
    <ul className="list-disc pl-4 mb-2 space-y-1">{props.children}</ul>
  ),
  ol: (props: MarkdownProps) => (
    <ol className="list-decimal pl-4 mb-2 space-y-1">{props.children}</ol>
  ),
  li: (props: MarkdownProps) => (
    <li className="ml-2">{props.children}</li>
  ),
  code: (props: MarkdownProps) => {
    const isInline = !props.className;
    return isInline ? (
      <code className="bg-secondary/30 px-1 py-0.5 rounded text-primary">{props.children}</code>
    ) : (
      <code className="block bg-secondary/30 p-3 rounded-lg my-2 text-sm overflow-x-auto">{props.children}</code>
    );
  },
  blockquote: (props: MarkdownProps) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">{props.children}</blockquote>
  ),
  a: (props: MarkdownProps) => (
    <a 
      className="text-primary hover:underline" 
      href={props.href} 
      target="_blank" 
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  ),
};