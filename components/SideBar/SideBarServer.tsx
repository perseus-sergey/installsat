import { ELanguage } from '@/models/language.model';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import UserWelcome from '../UserWelcome/UserWelcome';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Accordion = dynamic(() => import('../menuAccordion/Accordion/Accordion'));
const AccordionAdmin = dynamic(
  () => import('../menuAccordion/Accordion/AccordionAdmin')
);

const SideBarServer = ({
  isAdmin = false,
  lang,
}: {
  isAdmin?: boolean;
  lang: ELanguage;
}) => {
  return (
    <>
      {!isAdmin && (
        <div className="lg:hidden">
          <Suspense>
            <WidgetLastNews lang={lang} />
          </Suspense>
        </div>
      )}
      {isAdmin ? (
        <AccordionAdmin />
      ) : (
        <Suspense>
          <Accordion lang={lang} />
        </Suspense>
      )}
      {!isAdmin && (
        <Suspense>
          <WidgetArticleCategories lang={lang} />
        </Suspense>
      )}
      <UserWelcome />
    </>
  );
};

export default SideBarServer;
