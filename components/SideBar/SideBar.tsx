import { SIDE_BAR_CLOSE_BTN } from '@/models/ui.model';
import Accordion from '../menuAccordion/Accordion/Accordion';
import ToggleSidebarLabel from '../ui/ToggleSidebarLabel/ToggleSidebarLabel';
import WidgetArticleCategories from '../WidgetArticleCategories/WidgetArticleCategories';
import WidgetLastNews from '../WidgetLastNews/WidgetLastNews';
import styles from './SideBar.module.scss';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { auth, signOut } from '@/auth';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';

const SideBar = async () => {
  const session = await auth();

  return (
    <aside className="sidebar" data-testid="SideBar">
      <ToggleSidebarLabel className={styles.ToggleSidebarLabel}>
        {SIDE_BAR_CLOSE_BTN}
      </ToggleSidebarLabel>
      <WidgetLastNews />
      <Accordion />
      <WidgetArticleCategories />

      {session && session.user ? (
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <p className="text-gray-50">Hello {session.user?.name}!</p>
          <BaseButton
            type="submit"
            ariaLabel="Sign Out"
            className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          >
            <span>⏻</span>
            <span className="hidden md:block">Sign Out</span>
          </BaseButton>
        </form>
      ) : (
        <Link
          href={`/${EUrlBaseParam.SIGN_IN}`}
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>⏼</span>
          <span className="hidden md:block">Log In</span>
        </Link>
      )}
    </aside>
  );
};

export default SideBar;
