// import styles from './WrongSegment.module.scss';
import Link from 'next/link';
import TextButton from '../../ui/buttons/TextButton/TextButton';
import { Title } from '../../ui/Title/Title';

type TWrongSegmentProps = {
  wrongMessage: string;
  redirectPath: string;
  btnTitle: string;
};

const WrongSegment = ({
  wrongMessage,
  redirectPath,
  btnTitle,
}: TWrongSegmentProps) => (
  <>
    <Title>{wrongMessage}</Title>
    <Link href={redirectPath}>
      <TextButton ariaLabel="Go back">{btnTitle}</TextButton>
    </Link>
  </>
);

export default WrongSegment;
