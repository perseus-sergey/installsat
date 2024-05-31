'use client';

import { useFormState } from 'react-dom';
import {
  authenticateAction,
  createUserAction,
  restProviderLinksAction,
} from '@/libs/actions/login.action';
import { SubmitPendingButton } from '../ui/buttons/SubmitPendingBtn';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { AUTH_PROVIDER_LOGOS, ELoginFormNames } from '@/models/login.model';
import FieldError from '../comments/FieldError/FieldError';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { providerMap } from '@/auth';
import { SatelliteBroadcastIcon } from '../ui/icons-svg/SatelliteBroadcastIcon';

const BASE_URL = process.env.BASE_URL || '';

const { PASSWORD, NAME, EMAIL } = ELoginFormNames;

export default function SignUpForm({
  isLoginForm = false,
}: {
  isLoginForm?: boolean;
}) {
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
    <section className="rounded-lg bg-blue-950 px-6 py-4 max-w-96 w-4/5 mx-auto my-4 shadow-md">
      <form id="login-form" action={formAction}>
        <SatelliteBroadcastIcon className="w-8 h-8 text-gray-100" />
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
            <FieldError formState={formState} name={NAME} />
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
        <FieldError formState={formState} name={EMAIL} />

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
        <FieldError formState={formState} name={PASSWORD} />
        <SubmitPendingButton
          className="mt-4 w-full text-gray-50"
          ariaLabel="Submit"
        >
          {isLoginForm ? 'Log In' : 'Sign Up'}{' '}
          <span className="ml-auto text-gray-300">➠</span>
        </SubmitPendingButton>
        {noScriptFallback}
        {!isLoginForm && (
          <Link href={EUrlBaseParam.SIGN_IN} className="text-gray-300">
            Log In
          </Link>
        )}
      </form>

      <div className="flex flex-col items-start gap-2 py-6">
        {...providerMap.map(
          (provider) =>
            provider.id !== 'credentials' && (
              <SubmitPendingButton
                className="flex items-center gap-2 text-gray-50"
                ariaLabel={`Sign in with ${provider.name}`}
                onClick={async () =>
                  restProviderLinksAction(provider.id, BASE_URL)
                }
                key={provider.id}
              >
                {AUTH_PROVIDER_LOGOS[provider.id]}
                <span>Sign in with {provider.name}</span>
              </SubmitPendingButton>
            )
        )}
      </div>
    </section>
  );
}
// <Link
//   href={`/${isLoginForm ? EUrlBaseParam.SIGN_UP : EUrlBaseParam.SIGN_IN}`}
//   className="text-gray-300"
// >
//   {isLoginForm ? 'Registration' : 'Log In'}
// </Link>
