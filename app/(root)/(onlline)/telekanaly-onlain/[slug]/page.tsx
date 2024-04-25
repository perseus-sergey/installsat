import { Title } from '@/components/ui/Title/Title';

interface IProps {
  params: { slug: string };
}

export default function Page({ params: { slug } }: IProps) {
  return (
    <>
      <article className="article">
        <Title>Канал &quot;{slug}&quot; у прямому ефірі онлайн</Title>
      </article>
    </>
  );
}
