import Accordion from '../Accordion/Accordion';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';

const SideBar = () => (
  <aside className="sidebar" data-testid="SideBar">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      ⚔
    </ToggleSidebarLabel>
    <WidgetLastNews />
    <Accordion />
    <WidgetArticleCategories />
  </aside>
);

export default SideBar;
