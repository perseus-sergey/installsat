import { Title } from '@/components/Title/Title';

interface IHomeParams {
  params: { date: string };
}

export default function Home({ params }: IHomeParams) {
  return (
    <>
      <Title name={`Page for ${params.date}`} />
    </>
  );
}
