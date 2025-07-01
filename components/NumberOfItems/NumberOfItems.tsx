import { IFlyChannel } from '@/models/channels/channel.model';

export default async function NumberOfItems({
  requestFn,
}: {
  requestFn: () => Promise<IFlyChannel[]>;
}) {
  const satChannelsRes = await requestFn();

  return satChannelsRes instanceof Error ||
    (satChannelsRes[0] && satChannelsRes[0].sat_works !== 1)
    ? 0
    : satChannelsRes.length;
}
