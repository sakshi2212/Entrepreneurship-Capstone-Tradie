import React from "react";
import { MarkdownProps } from "./types";

export const Heading: React.FC<MarkdownProps> = ({ level = 1, children }) => {
  const className = level === 1 
    ? "text-2xl font-bold mt-4 mb-2 text-primary"
    : level === 2 
    ? "text-xl font-bold mt-3 mb-2 text-primary/90"
    : "text-lg font-bold mt-3 mb-2 text-primary/80";

  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className}>{children}</Tag>;
};

export const Paragraph: React.FC<MarkdownProps> = ({ children }) => (
  <p className="mb-2 leading-relaxed">{children}</p>
);

export const List: React.FC<MarkdownProps> = ({ children, className }) => {
  const isOrdered = className?.includes("ordered");
  const Tag = isOrdered ? "ol" : "ul";
  const listClass = isOrdered ? "list-decimal" : "list-disc";
  
  return (
    <Tag className={`${listClass} pl-4 mb-2 space-y-1`}>{children}</Tag>
  );
};

export const ListItem: React.FC<MarkdownProps> = ({ children }) => (
  <li className="ml-2">{children}</li>
);

export const Code: React.FC<MarkdownProps> = ({ children, inline, className }) => {
  if (inline) {
    return <code className="bg-secondary/30 px-1 py-0.5 rounded text-primary">{children}</code>;
  }
  return (
    <code className="block bg-secondary/30 p-3 rounded-lg my-2 text-sm overflow-x-auto">
      {children}
    </code>
  );
};

export const Blockquote: React.FC<MarkdownProps> = ({ children }) => (
  <blockquote className="border-l-4 border-primary/30 pl-4 italic my-2">{children}</blockquote>
);

export const Link: React.FC<MarkdownProps> = ({ children, href }) => (
  <a 
    className="text-primary hover:underline" 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    {children}
  </a>
);