import { DetailedHTMLProps, HTMLAttributes } from "react";

export interface MarkdownProps {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  level?: 1 | 2 | 3;
  inline?: boolean;
}

export interface HeadingProps extends DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement> {
  level?: 1 | 2 | 3;
}

export interface LinkProps extends DetailedHTMLProps<HTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  href?: string;
}

export interface ListProps extends DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement> {
  ordered?: boolean;
}

export interface ListItemProps extends DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement> {}

export interface CodeProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  inline?: boolean;
}

export interface BlockquoteProps extends DetailedHTMLProps<HTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement> {}

export interface ParagraphProps extends DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> {}