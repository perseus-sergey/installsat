import { Title } from '@/components/ui/Titles/Title';
import * as React from 'react';

interface IParams {
  params: { id: string };
}
export default function Page({ params: { id } }: IParams) {
  return <Title>Edit channel: {id}</Title>;
}
