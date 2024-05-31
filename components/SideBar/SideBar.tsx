import { SIDE_BAR_CLOSE_BTN } from '@/models/ui.model';
import Accordion from '../menuAccordion/Accordion/Accordion';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import UserWelcome from '../UserWelcome/UserWelcome';
import AccordionAdmin from '../menuAccordion/Accordion/AccordionAdmin';

const SideBar = async ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <aside className="sidebar" data-testid="SideBar">
      <ToggleSidebarLabel className="inline-block my-4 text-3xl text-gray-200 border border-gray-400 rounded-full py-2 px-4 cursor-pointer">
        {SIDE_BAR_CLOSE_BTN}
      </ToggleSidebarLabel>
      {!isAdmin && <WidgetLastNews />}
      {isAdmin ? <AccordionAdmin /> : <Accordion />}
      {!isAdmin && <WidgetArticleCategories />}
      <UserWelcome />
    </aside>
  );
};

export default SideBar;
