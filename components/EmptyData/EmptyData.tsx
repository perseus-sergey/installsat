// import styles from './EmptyData.module.scss';

import { EUITitles, MUITitles } from '@/models/ui.model';

interface IEmptyDataProps {
  description?: string;
}

const EmptyData = ({ description }: IEmptyDataProps) => (
  <h3 className="p-5 font-bold text-purple-600" data-testid="EmptyData">
    {MUITitles.get(EUITitles.ERROR_EMPTY_DATA)?.ua}
    {description ? <span>: {description}</span> : null}
  </h3>
);

export default EmptyData;
