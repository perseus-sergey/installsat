'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import { getArticlesForCarousel } from '@/controllers/articleCarousel.controller';
import { IArticleCarousel } from '@/models/articles/articleCarousel.model';
import { ELanguage } from '@/models/language.model';
import SeoLink from './ui/SeoLink/SeoLink';
import { EUrlBaseParam } from '@/models/url/url.model';
import {
  ARTICLE_CARD_IMAGES,
  getSeoCardLinkTitle,
} from '@/models/articles/article.model';
import { IMG_PROPERTIES } from '@/models/ui/image.model';
import { TRANS_NEWS_CAROUSEL_IMAGE } from '@/models/satDigest.model';

const { articleBigImg } = ARTICLE_CARD_IMAGES;

const ArticleKeenCarousel = ({
  quantity = 10,
  sleepTime = 2000,
  lang,
}: {
  quantity?: number;
  sleepTime?: number;
  lang: ELanguage;
}) => {
  const [articles, setArticles] = useState<IArticleCarousel[]>([]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      defaultAnimation: {
        duration: 800, // Set animation speed to 1 second
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, sleepTime);
        }

        function onMouseOver() {
          mouseOver = true;
          clearNextTimeout();
        }

        function onMouseOut() {
          mouseOver = false;
          nextTimeout();
        }

        slider.on('created', () => {
          const container = slider.container;

          // Add event listeners
          container.addEventListener('mouseover', onMouseOver);
          container.addEventListener('mouseout', onMouseOut);

          nextTimeout();
        });

        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);

        slider.on('destroyed', () => {
          const container = slider.container;

          // Remove event listeners
          container.removeEventListener('mouseover', onMouseOver);
          container.removeEventListener('mouseout', onMouseOut);

          clearNextTimeout(); // Clear any remaining timeouts
        });
      },
    ]
  );

  useEffect(() => {
    const setItems = async () => {
      const news = await getArticlesForCarousel({
        quantity: quantity,
        lang: lang,
      });

      setArticles(news);
    };

    setItems();
  }, []);

  return articles.length > 0 ? (
    <div ref={sliderRef} className="keen-slider">
      {articles.map((article) => (
        <div key={article.id} className="keen-slider__slide">
          <SeoLink
            href={`/${lang}/${EUrlBaseParam.ARTICLE}/${article.cpu}`}
            title={getSeoCardLinkTitle(article.title)[lang]}
          >
            <div className="mx-auto w-[300px] h-[200px] sm:w-[500px] sm:h-[400px] relative sm:shadow-[4px_8px_8px_rgba(0,0,0,0.4)]">
              <Image
                className="rounded border border-slate-700"
                src={`${articleBigImg.params.path}${article.cpu}.jpg`}
                alt={articleBigImg.getAlt(article.title)[lang]}
                fill
                sizes="500px"
                placeholder="blur"
                blurDataURL={IMG_PROPERTIES.defaultImgBlur}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2">
                <h3 className="text-lg font-semibold">{article.title}</h3>
              </div>
            </div>
          </SeoLink>
        </div>
      ))}
    </div>
  ) : (
    <div className="mx-auto w-[300px] h-[200px] sm:w-[600px] sm:h-[400px] relative">
      <Image
        className="mx-auto rounded border border-slate-700 sm:shadow-[4px_8px_8px_rgba(0,0,0,0.4)]"
        src={`${articleBigImg.params.path}${TRANS_NEWS_CAROUSEL_IMAGE.imgTitle}`}
        alt={TRANS_NEWS_CAROUSEL_IMAGE.alt[lang]}
        fill
        sizes="600px"
        placeholder="blur"
        blurDataURL={IMG_PROPERTIES.defaultImgBlur}
      />
    </div>
  );
};

export default ArticleKeenCarousel;
