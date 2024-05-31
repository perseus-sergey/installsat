import { isAdminAuth } from '@/controllers/login.controller';
import Link from 'next/link';

const EditLinkButton = async ({ href }: { href: string }) =>
  (await isAdminAuth()) ? (
    <Link className="text-gray-100" href={href}>
      ✎
    </Link>
  ) : null;

export default EditLinkButton;
