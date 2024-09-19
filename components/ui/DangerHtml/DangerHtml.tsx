interface IDangerHtmlProps {
  text: string;
  className?: string;
  wrapperTagName?: keyof JSX.IntrinsicElements;
}

const DangerHtml: React.FC<IDangerHtmlProps> = ({
  text,
  wrapperTagName = 'div',
  className,
}: IDangerHtmlProps) => {
  const TagName = wrapperTagName as keyof JSX.IntrinsicElements;

  return (
    <TagName dangerouslySetInnerHTML={{ __html: text }} className={className} />
  );
};

export default DangerHtml;
