import { ELanguage } from '@/models/language.model';
import { SimilarFlyChannel } from '../SimilarChannel/SimilarChannel';
import { getSimilarFlyChannels } from '@/controllers/channel.controller';
import SimilarBlock from './SimilarBlock';

interface ISimilarArticlesProps {
  chanelTitle: string;
  sectionCaption: string;
  lang: ELanguage;
}

const SimilarChannels = async ({
  chanelTitle,
  sectionCaption,
  lang,
}: ISimilarArticlesProps) => {
  const similarChannels = await getSimilarFlyChannels(chanelTitle);

  if (similarChannels.length === 0) return null;

  return (
    <SimilarBlock blockTitle={sectionCaption}>
      {similarChannels.map((chan) => (
        <li key={chan.slug}>
          <SimilarFlyChannel
            lang={lang}
            chanParams={chan}
            chanName={chanelTitle}
          />
        </li>
      ))}
    </SimilarBlock>
  );
};

export default SimilarChannels;
