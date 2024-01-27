import { Title } from '@/components/Title/Title';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <Title name="Page not found (404)" />
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
