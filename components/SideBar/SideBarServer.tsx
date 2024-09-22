import { ELanguage } from '@/models/ui.model';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import UserWelcome from '../UserWelcome/UserWelcome';
import dynamic from 'next/dynamic';

const SideBarServer = ({
  isAdmin = false,
  lang,
}: {
  isAdmin?: boolean;
  lang: ELanguage;
}) => {
  const Accordion = dynamic(
    () => import('../menuAccordion/Accordion/Accordion')
  );
  const AccordionAdmin = dynamic(
    () => import('../menuAccordion/Accordion/AccordionAdmin')
  );

  return (
    <>
      {!isAdmin && <WidgetLastNews lang={lang} />}
      {isAdmin ? <AccordionAdmin /> : <Accordion lang={lang} />}
      {!isAdmin && <WidgetArticleCategories lang={lang} />}
      <UserWelcome />
    </>
  );
};

export default SideBarServer;
