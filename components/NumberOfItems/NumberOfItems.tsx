import { IFlyChannel } from '@/models/channel.model';

export default async function NumberOfItems({
  requestFn,
}: {
  requestFn: () => Promise<IFlyChannel[]>;
}) {
  const satChannelsRes = await requestFn();

  return satChannelsRes instanceof Error ? 0 : satChannelsRes.length;
}
