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
    <div className={styles.sliderWrapper} data-testid="ChannelFormatSliders">
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
      {title}
    </div>
    // <div className={styles.sliderWrapper} data-testid="ChannelFormatSliders">
    //   <div className={styles.slideSat}>
    //     <input
    //       type="checkbox"
    //       checked={isT2miChecked}
    //       onChange={(e) => onT2miChange(e.target.checked)}
    //       id="t2-mi"
    //       name="t2-mi"
    //     />
    //     <label htmlFor="t2-mi"></label>
    //   </div>
    //   T2-MI
    // </div>
    // <div className={styles.sliderWrapper}>
    //   <div className={styles.slideSat}>
    //     <input
    //       type="checkbox"
    //       checked={isMp4Checked}
    //       onChange={(e) => onMp4Change(e.target.checked)}
    //       id="mpeg4"
    //       name="mpeg4"
    //     />
    //     <label htmlFor="mpeg4"></label>
    //   </div>
    //   MPEG-4, DVB-S2, HD, 4K(UHD)
    // </div>
  );
};

export default ChannelFormatSliders;
