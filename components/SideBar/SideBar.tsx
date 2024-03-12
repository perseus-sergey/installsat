import Accordion from '../Accordion/Accordion';
import ToggleSidebarLabel from '../ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';
// import './SideBar.scss';

const SideBar = () => (
  <aside className="sidebar" data-testid="SideBar">
    <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
      ⚔
    </ToggleSidebarLabel>
    <WidgetLastNews />
    <Accordion />
  </aside>
);

export default SideBar;
