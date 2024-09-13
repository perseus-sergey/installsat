import { ELanguage, SIDE_BAR_CLOSE_BTN } from '@/models/ui.model';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import UserWelcome from '../UserWelcome/UserWelcome';
import dynamic from 'next/dynamic';

const SideBar = async ({
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
    <aside className="sidebar" data-testid="SideBar">
      <ToggleSidebarLabel className="inline-block my-4 text-3xl text-gray-200 border border-gray-400 rounded-full py-2 px-4 cursor-pointer">
        {SIDE_BAR_CLOSE_BTN}
      </ToggleSidebarLabel>
      {!isAdmin && <WidgetLastNews lang={lang} />}
      {isAdmin ? <AccordionAdmin /> : <Accordion lang={lang} />}
      {!isAdmin && <WidgetArticleCategories lang={lang} />}
      <UserWelcome />
    </aside>
  );
};

export default SideBar;
