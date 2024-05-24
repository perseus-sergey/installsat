'use server';

import { signIn } from '@/auth';
import { createDbUser, getDbUser } from '@/controllers/login.controller';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { AuthError } from 'next-auth';
import { ZodError, z } from 'zod';
import bcryptjs from 'bcryptjs';
import { ELoginFormNames } from '@/models/login.model';

const { PASSWORD, NAME, EMAIL } = ELoginFormNames;

const logInSchema = z.object({
  [EMAIL]: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  [PASSWORD]: z
    .string()
    .min(8, { message: 'Must be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
});

const credentialsSchema = z.object({
  ...logInSchema.shape,
  [NAME]: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(20, { message: 'Name must be no more than 20 characters.' })
    .trim(),
});

export async function authenticateAction(
  _prevState: IFormState | undefined,
  formData: FormData
) {
  try {
    const validFormData = logInSchema.parse({
      [EMAIL]: formData.get(EMAIL),
      [PASSWORD]: formData.get(PASSWORD),
    });

    const user = (await getDbUser(validFormData[EMAIL]))[0];
    const isValidUser =
      user && (await bcryptjs.compare(validFormData[PASSWORD], user.password));
    if (isValidUser)
      await signIn('credentials', {
        name: user.name,
        email: user.email,
      });

    return isValidUser
      ? toFormState('SUCCESS', 'Login successfully!')
      : toFormState('ERROR', 'Invalid credentials');
  } catch (error) {
    if (error instanceof AuthError || error instanceof ZodError)
      return fromErrorToFormState(error);

    throw error;
  }
}

export async function createUserAction(
  _prevState: IFormState | undefined,
  formData: FormData
) {
  try {
    const validFormData = credentialsSchema.parse({
      [EMAIL]: formData.get(EMAIL),
      [PASSWORD]: formData.get(PASSWORD),
      [NAME]: formData.get(NAME),
    });

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(validFormData[PASSWORD], salt);

    const res = await createDbUser(
      validFormData[EMAIL],
      hashedPassword,
      validFormData[NAME]
    );
    if (res instanceof Error)
      return toFormState(
        'ERROR',
        res.message.startsWith('Duplicate entry')
          ? 'Entered eMail are already registered. Try to enter another one.'
          : 'An error occurred while registering a user in the database. Please try again later..'
      );

    return toFormState('SUCCESS', 'User created successfully');
  } catch (error) {
    return fromErrorToFormState(error);
  }
}

// =================================================================
// Check callback in production
// =================================================================
export const restProviderLinksAction = async (
  providerId: string,
  callbackUrl: string
) => await signIn(providerId, { redirectTo: callbackUrl });
