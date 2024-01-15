// import styles from './WrongSegment.module.scss';
import Link from 'next/link';
import TextButton from '../TextButton/TextButton';

type TWrongSegmentProps = {
  wrongMessage: string;
  redirectPath: string;
  btnTitle: string;
};

const WrongSegment = ({ wrongMessage, redirectPath, btnTitle }: TWrongSegmentProps) => (
  <>
    <h1>{wrongMessage}</h1>
    <Link href={redirectPath}>
      <TextButton>{btnTitle}</TextButton>
    </Link>
  </>
);

export default WrongSegment;
