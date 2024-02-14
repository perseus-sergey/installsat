import styles from './SideBar.module.scss';

interface ISideBarProps {
  children?: React.ReactNode;
}

const SideBar = ({ children = 'SideBar' }: ISideBarProps) => (
  <div className={styles.SideBar} data-testid="SideBar">
    <h2>{children}</h2>
  </div>
);

export default SideBar;
