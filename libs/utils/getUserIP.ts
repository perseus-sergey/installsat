import { IUserLocation } from '@/models/userLocation.model';
import { headers } from 'next/headers';
import { cache } from 'react';

const getUserIP = () =>
  (headers().get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];

export const fetchUserLocation = cache(
  async (): Promise<IUserLocation | null> => {
    const ip = getUserIP();
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) return null;

    return response.json();
  }
);
