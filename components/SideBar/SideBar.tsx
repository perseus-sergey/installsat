import { SIDE_BAR_CLOSE_BTN } from '@/models/ui.model';
import Accordion from '../menuAccordion/Accordion/Accordion';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';

const SideBar = async () => {
  return (
    <aside className="sidebar" data-testid="SideBar">
      <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
        {SIDE_BAR_CLOSE_BTN}
      </ToggleSidebarLabel>
      <WidgetLastNews />
      <Accordion />
      <WidgetArticleCategories />
      {/* <UserWelcome /> */}
    </aside>
  );
};

export default SideBar;
