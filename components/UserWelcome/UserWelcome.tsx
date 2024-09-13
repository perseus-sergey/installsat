import { auth, signOut } from '@/auth';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';

const UserWelcome = async () => {
  const session = await auth();

  return session && session.user ? (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
      data-testid="UserWelcome"
    >
      <p className="text-gray-50">Hello, {session.user?.name}!</p>
      <BaseButton
        type="submit"
        ariaLabel="Sign Out"
        className="flex grow items-center justify-center gap-2 rounded-md bg-gray-50 px-4 py-1 text-sm font-medium hover:bg-sky-100 hover:text-blue-600"
      >
        <span className="text-2xl">⏻</span>
        <span className="hidden md:block">Sign Out</span>
      </BaseButton>
    </form>
  ) : null;
  // (
  //   <Link
  //     href={`/${EUrlBaseParam.SIGN_IN}`}
  //     className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
  //   >
  //     <span>⏼</span>
  //     <span className="hidden md:block">Log In</span>
  //   </Link>
  // );
};

export default UserWelcome;
