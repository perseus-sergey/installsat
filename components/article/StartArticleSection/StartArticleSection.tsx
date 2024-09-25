interface IStartArticleSectionProps {
  children?: React.ReactNode;
}

const StartArticleSection = ({ children }: IStartArticleSectionProps) => (
  <section
    style={{ textShadow: '1px 1px 0 #f9f9f9' }}
    className="font-verdana text-blue-800 text-left font-semibold p-6"
  >
    {children}
  </section>
);

export default StartArticleSection;
