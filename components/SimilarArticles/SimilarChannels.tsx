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
    <SimilarBlock blockTitle={sectionCaption} lang={lang}>
      {similarChannels.map((chan, idx) => (
        <li key={idx}>
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
