import { SIDE_BAR_CLOSE_BTN } from '@/models/ui.model';
import Accordion from '../Accordion/Accordion';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';

const SideBar = () => (
  <aside className="sidebar" data-testid="SideBar">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      {SIDE_BAR_CLOSE_BTN}
    </ToggleSidebarLabel>
    <WidgetLastNews />
    <Accordion />
    <WidgetArticleCategories />
  </aside>
);

export default SideBar;
