'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
      <div
        style={{
          boxShadow: 'inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5)',
        }}
        className="bg-gradient-to-b from-yellow-50 to-gray-300 rounded-full h-6 w-14"
      >
        <div
          className="bg-gradient-to-b from-blue-950 to-blue-400 h-5 m-0.5 relative rounded-full text-white text-[8px] leading-5 font-bold font-verdana before:content-['OFF'] before:absolute before:left-1 after:content-['ON'] after:text-green-300 after:absolute after:right-1 z-0"
          style={{
            boxShadow:
              'inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2)',
            textShadow: '1px 1px 0px rgb(29 4 4)',
          }}
        >
          <input
            className={`peer hidden`}
            type="checkbox"
            checked={searchParams.has(searchQueryName)}
            onChange={(e) => onChange(e.target.checked)}
            id={searchQueryName}
            name={searchQueryName}
          />
          <label
            htmlFor={searchQueryName}
            className={`peer-checked:left-6 left-1 drop-shadow-md bg-gradient-to-b from-stone-50 to-stone-400 block h-4 w-6 cursor-pointer absolute top-0.5 z-[1] rounded-full transition-all duration-300 ease`}
          ></label>
        </div>
      </div>
      {title}
    </div>
  );
};

export default ChannelFormatSliders;
