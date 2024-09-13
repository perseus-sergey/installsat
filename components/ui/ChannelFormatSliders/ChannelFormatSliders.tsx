'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import styles from './ChannelFormatSliders.module.scss';
import {
  EUrlSearchParam,
  URL_SEARCH_PARAM_VALUE_FALSE,
} from '@/models/url.model';

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
      params.set(searchQueryName, URL_SEARCH_PARAM_VALUE_FALSE);
    } else {
      params.delete(searchQueryName);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div
      className="flex items-center gap-4 py-1 px-4"
      data-testid="ChannelFormatSliders"
    >
      <div className={`${styles.sliderWrapper} rounded-full h-6 w-14`}>
        <div className={`${styles.slider} h-5 m-0.5 relative rounded-full`}>
          <input
            className={`${styles.sliderCheckbox} hidden`}
            type="checkbox"
            checked={searchParams.has(searchQueryName)}
            onChange={(e) => onChange(e.target.checked)}
            id={searchQueryName}
            name={searchQueryName}
          />
          <label
            htmlFor={searchQueryName}
            className={`${styles.sliderLabel} block h-4 w-6 cursor-pointer absolute top-0.5 left-1 z-[1] rounded-full transition-all duration-300 ease`}
          ></label>
        </div>
      </div>
      {title}
    </div>
  );
};

export default ChannelFormatSliders;
