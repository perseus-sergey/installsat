import React from 'react';

interface IDangerHtmlProps {
  text: string;
  wrapperTagName?: string;
}

const DangerHtml: React.FC<IDangerHtmlProps> = ({
  text,
  wrapperTagName = 'div',
}: IDangerHtmlProps) => {
  const TagName = wrapperTagName as keyof JSX.IntrinsicElements;

  return <TagName dangerouslySetInnerHTML={{ __html: text }} />;
};

export default DangerHtml;
