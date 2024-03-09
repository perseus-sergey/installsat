// import styles from './WrongSegment.module.scss';
import Link from 'next/link';
import TextButton from '../TextButton/TextButton';
import { Title } from '../Title/Title';

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
      <TextButton>{btnTitle}</TextButton>
    </Link>
  </>
);

export default WrongSegment;
