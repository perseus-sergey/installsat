import { ELanguage } from '@/models/ui.model';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import UserWelcome from '../UserWelcome/UserWelcome';
import dynamic from 'next/dynamic';
import { OPEN_SIDE_BAR_BTN } from '@/models/header.model';
import sideBarCloseImg from 'public/Images/accordion/sidebar_hide_icon.png';
import Image from 'next/image';

const { sideBarCloseIcon } = OPEN_SIDE_BAR_BTN;

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
    <aside
      className="sidebar bg-slate-900 lg:bg-transparent flex-1 p-2 transition-all ease-linear duration-300 lg:static fixed -left-full top-0 h-full w-5/6 max-w-lg min-w-72 lg:z-0 z-[101]"
      data-testid="SideBar"
    >
      <ToggleSidebarLabel
        ariaLabel={sideBarCloseIcon.ariaLabel[lang]}
        className="inline-block p-4 cursor-pointer"
      >
        <Image src={sideBarCloseImg} alt={sideBarCloseIcon.alt[lang]} />
      </ToggleSidebarLabel>
      {!isAdmin && <WidgetLastNews lang={lang} />}
      {isAdmin ? <AccordionAdmin /> : <Accordion lang={lang} />}
      {!isAdmin && <WidgetArticleCategories lang={lang} />}
      <UserWelcome />
    </aside>
  );
};

export default SideBar;
