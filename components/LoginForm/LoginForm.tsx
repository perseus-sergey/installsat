'use client';

// import { lusitana } from '@/app/ui/fonts';
// import {
//   AtSymbolIcon,
//   KeyIcon,
//   ExclamationCircleIcon,
// } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import { SubmitPendingButton } from '../ui/buttons/SubmitPendingBtn';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { ELoginFormNames } from '@/models/login.model';
import { authenticateAction } from '@/libs/actions/login.action';
import FieldError from '../comments/FieldError/FieldError';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
// import { authenticate } from '@/app/lib/actions';

const { PASSWORD, EMAIL } = ELoginFormNames;

export default function LoginForm() {
  const [formState, formAction] = useFormState(
    authenticateAction,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <form
      className="rounded-lg bg-blue-950 px-6 py-4 max-w-96 w-4/5 mx-auto my-4 shadow-md"
      id="login-form"
      // ref={formRef}
      action={formAction}
    >
      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-50"
        htmlFor={EMAIL}
      >
        Email
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id={EMAIL}
          type="email"
          name={EMAIL}
          placeholder="Enter your email address"
          aria-label="Enter your email address"
          aria-describedby={`${EMAIL}-error`}
          size={10}
          required
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
          @
        </span>
      </div>
      <FieldError
        formState={formState}
        name={EMAIL}
        errorFieldId={`${EMAIL}-error`}
      />

      <label
        className="mb-3 mt-5 block text-xs font-medium text-gray-50"
        htmlFor={PASSWORD}
      >
        Password
      </label>
      <div className="relative">
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
          id={PASSWORD}
          type="password"
          name={PASSWORD}
          placeholder="Enter password"
          aria-label="Enter password"
          aria-describedby={`${PASSWORD}-error`}
          size={10}
          required
          minLength={6}
        />
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
          🔑
        </span>
      </div>
      <FieldError
        formState={formState}
        name={PASSWORD}
        errorFieldId={`${PASSWORD}-error`}
      />
      <SubmitPendingButton
        className="mt-4 w-full text-gray-50"
        ariaLabel="Submit"
      >
        Log In <span className="ml-auto text-gray-300">➠</span>
        {/* Sign Up <span className="ml-auto text-gray-300">➠</span> */}
      </SubmitPendingButton>
      {noScriptFallback}
      <Link href={`/${EUrlBaseParam.SIGN_UP}`} className="text-gray-300">
        Registration
      </Link>
      {/* <Link href={`/${EUrlBaseParam.SIGN_IN}`} className="text-gray-300">
        Log In
      </Link> */}
    </form>
  );
  // return (
  //   <form action={formAction} className="space-y-3">
  //     <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
  //       {/* <h1 className={`${lusitana.className} mb-3 text-2xl`}>
  //         Please log in to continue.
  //       </h1> */}
  //       {/* <Title>Please log in to continue.</Title> */}
  //       <div className="w-full">
  //         <div>
  //           <label
  //             className="mb-3 mt-5 block text-xs font-medium text-gray-900"
  //             htmlFor={EMAIL}
  //           >
  //             Email
  //           </label>
  //           <div className="relative">
  //             <input
  //               className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  //               id={EMAIL}
  //               type="email"
  //               name={EMAIL}
  //               placeholder="Enter your email address"
  //               required
  //             />
  //             <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
  //               @
  //             </span>
  //             {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
  //           </div>
  //         </div>
  //         <div className="mt-4">
  //           <label
  //             className="mb-3 mt-5 block text-xs font-medium text-gray-900"
  //             htmlFor={PASSWORD}
  //           >
  //             Password
  //           </label>
  //           <div className="relative">
  //             <input
  //               className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
  //               id={PASSWORD}
  //               type="password"
  //               name={PASSWORD}
  //               placeholder="Enter password"
  //               required
  //               minLength={6}
  //             />
  //             {/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
  //             <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
  //               🔑
  //             </span>
  //           </div>
  //         </div>
  //       </div>
  //       <SubmitPendingButton className="mt-4 w-full" ariaLabel="Submit">
  //         Log in <span className="ml-auto text-gray-400">➠</span>
  //       </SubmitPendingButton>

  //       <Link href={`/${EUrlBaseParam.SIGN_UP}`}>Registration</Link>

  //       <div
  //         className="flex h-8 items-end space-x-1"
  //         aria-live="polite"
  //         aria-atomic="true"
  //       >
  //         {formState?.message && (
  //           <>
  //             {/* <ExclamationCircleIcon className="h-5 w-5 text-red-500" /> */}
  //             <span className="text-red-500">⚠</span>
  //             <p className="text-sm text-red-500">{formState.message}</p>
  //           </>
  //         )}
  //       </div>
  //     </div>
  //   </form>
  // );
}
