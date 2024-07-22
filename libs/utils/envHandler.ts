import { unstable_noStore as noStore } from 'next/cache';

export const getEnvVariable = (name: string, replacement?: string): string => {
  // Using noStore prevents this function from being rendered statically
  // This is a problem because the environment variables need to change between development and production
  noStore();
  const variable = process.env[name];
  if (!variable && !replacement) {
    throw new Error(`Missing environment variable for ${name}`);
  }

  return variable || replacement!;
};
