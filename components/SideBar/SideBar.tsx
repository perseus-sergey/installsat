import Accordion from '../Accordion/Accordion';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';

const SideBar = () => (
  <aside className={styles.SideBar} data-testid="SideBar">
    <WidgetLastNews />
    <Accordion />
  </aside>
);

export default SideBar;
