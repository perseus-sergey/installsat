import { headers } from 'next/headers';

export interface IUserLocation {
  query: string;
  status: 'success' | 'fail';
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}

export const getUserIP = () =>
  (headers().get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

export const fetchUserLocation = async (): Promise<IUserLocation | null> => {
  const ip = getUserIP();
  const response = await fetch(`http://ip-api.com/json/${ip}`);
  if (!response.ok) return null;

  return response.json();
};
