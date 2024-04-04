'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './ChannelFormatSliders.module.scss';
import { EUrlSearchParam } from '@/models/url.model';

interface IChannelFormatSlidersProps {
  title: string;
  searchQueryName: EUrlSearchParam;
}

const ChannelFormatSliders = ({
  title,
  searchQueryName,
}: IChannelFormatSlidersProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const onChange = (isChecked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (isChecked) {
      params.set(searchQueryName, 'off');
    } else {
      params.delete(searchQueryName);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.sliderItem} data-testid="ChannelFormatSliders">
      <div className={styles.sliderWrapper}>
        <div className={styles.slider}>
          <input
            type="checkbox"
            checked={searchParams.has(searchQueryName)}
            onChange={(e) => onChange(e.target.checked)}
            id={searchQueryName}
            name={searchQueryName}
          />
          <label htmlFor={searchQueryName}></label>
        </div>
      </div>
      {title}
    </div>
  );
};

export default ChannelFormatSliders;
