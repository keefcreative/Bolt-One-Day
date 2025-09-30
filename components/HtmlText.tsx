/**
 * HtmlText Component
 *
 * A wrapper component that safely renders text containing HTML entities like &nbsp;
 * Use this instead of plain {text} when your JSON data contains HTML entities.
 */

import React from 'react';

interface HtmlTextProps {
  children: string;
  className?: string;
  as?: React.ElementType;
}

export default function HtmlText({ children, className = '', as: Component = 'span' }: HtmlTextProps) {
  if (!children) return null;

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  );
}