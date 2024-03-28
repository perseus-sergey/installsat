export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  return <article className="article">{children}</article>;
}
