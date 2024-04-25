// import styles from './EmptyData.module.scss';

import { LANGUAGE, ERRORS, IS_PRODUCTION } from '@/models/ui.model';

interface IEmptyDataProps {
  description?: string;
}

const EmptyData = ({ description }: IEmptyDataProps) => (
  <h3 className="p-5 font-bold text-purple-600" data-testid="EmptyData">
    {ERRORS.ERROR_EMPTY_DATA[LANGUAGE]}
    {description && !IS_PRODUCTION ? <span>: {description}</span> : null}
  </h3>
);

export default EmptyData;
