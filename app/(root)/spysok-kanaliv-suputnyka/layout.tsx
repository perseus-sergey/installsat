export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  return (
    <>
      <section className="articleWrapper">
        <article className="article">{children}</article>
      </section>
    </>
  );
}
