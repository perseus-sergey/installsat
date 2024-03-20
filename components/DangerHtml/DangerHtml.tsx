import React from 'react';

interface IDangerHtmlUlProps {
  text: string;
  wrapperTagName?: string;
}

const DangerHtml: React.FC<IDangerHtmlUlProps> = ({
  text,
  wrapperTagName = 'div',
}: IDangerHtmlUlProps) => {
  const TagName = wrapperTagName as keyof JSX.IntrinsicElements;

  return <TagName dangerouslySetInnerHTML={{ __html: text }} />;
};

export default DangerHtml;
