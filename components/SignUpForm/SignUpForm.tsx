'use client';

// import styles from './SignUpForm.module.scss';
// import { lusitana } from '@/app/ui/fonts';
// import {
//   AtSymbolIcon,
//   KeyIcon,
//   ExclamationCircleIcon,
// } from '@heroicons/react/24/outline';
// import { ArrowRightIcon } from '@heroicons/react/20/solid';
// import { Button } from '@/app/ui/button';
import { useFormState } from 'react-dom';
import {
  authenticateAction,
  createUserAction,
} from '@/libs/actions/login.action';
import { SubmitPendingButton } from '../ui/buttons/SubmitPendingBtn';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { ELoginFormNames } from '@/models/login.model';
import FieldError from '../comments/FieldError/FieldError';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
// import { authenticateAction } from '@/app/lib/actions';

const { PASSWORD, NAME, EMAIL } = ELoginFormNames;

export default function SignUpForm({
  isLoginForm = false,
}: {
  isLoginForm?: boolean;
}) {
  // const sendCommentHandler = formCommentAction.bind(
  //   null,
  //   articleId,
  //   userLocation && userLocation.status === 'success' ? userLocation.query : '',
  //   userLocation && userLocation.status === 'success'
  //     ? userLocation.countryCode
  //     : '',
  //   revalidateUrl,
  //   dbCommentTableName
  // );

  // const [formState, formAction] = useFormState(
  //   sendCommentHandler,
  //   EMPTY_FORM_STATE
  // );

  // useFormCommentSendEmail(
  //   formState,
  //   articleName,
  //   revalidateUrl,
  //   dbCommentTableName,
  //   articleId,
  //   userLocation,
  //   baseUrl,
  //   emailKey
  // );

  const [formState, formAction] = useFormState(
    isLoginForm ? authenticateAction : createUserAction,
    EMPTY_FORM_STATE
  );

  useEffect(() => {
    if (!isLoginForm && formState.status === 'SUCCESS') {
      redirect(EUrlBaseParam.BASE_PATH);
    }
  }, [formState.status, isLoginForm]);

  const noScriptFallback = useToastMessage(formState);

  return (
    <form
      className="rounded-lg bg-blue-950 px-6 py-4 max-w-96 w-4/5 mx-auto my-4 shadow-md"
      id="login-form"
      action={formAction}
    >
      {!isLoginForm && (
        <>
          <label
            className="mb-3 mt-5 block text-xs font-medium text-gray-50"
            htmlFor={NAME}
          >
            Name
          </label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
              id={NAME}
              name={NAME}
              placeholder="Enter your Name"
              aria-label="Enter your Name"
              aria-describedby={`${NAME}-error`}
              size={10}
              minLength={2}
              required
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900">
              🏷
            </span>
          </div>
          <FieldError
            formState={formState}
            name={NAME}
            errorFieldId={`${NAME}-error`}
          />
        </>
      )}

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
        {isLoginForm ? 'Log In' : 'Sign Up'}{' '}
        <span className="ml-auto text-gray-300">➠</span>
      </SubmitPendingButton>
      {noScriptFallback}
      <Link
        href={`/${isLoginForm ? EUrlBaseParam.SIGN_UP : EUrlBaseParam.SIGN_IN}`}
        className="text-gray-300"
      >
        {isLoginForm ? 'Registration' : 'Log In'}
      </Link>
    </form>
  );
}
