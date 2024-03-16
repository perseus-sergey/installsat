import React from 'react';

interface IDangerHtmlUlProps {
  text: string;
  tagName?: string;
}

const DangerHtml: React.FC<IDangerHtmlUlProps> = ({
  text,
  tagName = 'div',
}: IDangerHtmlUlProps) => {
  const TagName = tagName as keyof JSX.IntrinsicElements;

  return <TagName dangerouslySetInnerHTML={{ __html: text }} />;
};

export default DangerHtml;
