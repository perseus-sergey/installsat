import Accordion from '../Accordion/Accordion';
import styles from './SideBar.module.scss';

interface ISideBarProps {
  children?: React.ReactNode;
}

const SideBar = ({ children = 'SideBar' }: ISideBarProps) => (
  <aside className={styles.SideBar} data-testid="SideBar">
    <h2>{children}</h2>
    <Accordion />
  </aside>
);

export default SideBar;
