import Link from 'next/link';
import TooltipSimple from '../ui/TooltipSimple/TooltipSimple';
import { SubmitPendingButton } from '../ui/buttons/SubmitPendingBtn';
import styles from './ConfirmCancelButtons.module.scss';

interface IConfirmProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  pendingInnerHtml: React.ReactNode;
  title?: string;
}

interface ICancelProps extends React.LinkHTMLAttributes<HTMLAnchorElement> {
  href: string;
  ariaLabel: string;
  title?: string;
}

export const ConfirmSubmitButton = ({
  ariaLabel,
  title,
  pendingInnerHtml,
  ...attributes
}: IConfirmProps) => (
  <TooltipSimple tooltipText={ariaLabel}>
    <SubmitPendingButton
      className={styles.confirmButton}
      ariaLabel={ariaLabel}
      innerHtml={
        <>
          <span className={styles.checkMark}></span>
          {title}
        </>
      }
      pendingInnerHtml={pendingInnerHtml}
      {...attributes}
    />
  </TooltipSimple>
);

export const CancelLinkButton = ({
  ariaLabel,
  title,
  href,
  ...attributes
}: ICancelProps) => (
  <TooltipSimple tooltipText={ariaLabel}>
    <Link
      className={styles.cancelButton}
      aria-label={ariaLabel}
      href={href}
      role="button"
      {...attributes}
    >
      <span className={styles.crossMark}>❌</span>
      {title}
    </Link>
  </TooltipSimple>
);
