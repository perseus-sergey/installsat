import { Title } from '@/components/Title/Title';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <Title>Page not found (404)</Title>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
