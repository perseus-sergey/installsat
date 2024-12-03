'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { getArticlesForCarousel } from '@/controllers/articleCarousel.controller';
import { IArticleCarousel } from '@/models/articles/articleCarousel.model';
import { ELanguage } from '@/models/language.model';
// import SeoLink from './ui/SeoLink/SeoLink';
// import { EUrlBaseParam } from '@/models/url/url.model';
import {
  ARTICLE_CARD_IMAGES,
  //   getSeoCardLinkTitle,
} from '@/models/articles/article.model';
import { IMG_PROPERTIES } from '@/models/ui/image.model';

const { articleBigImg } = ARTICLE_CARD_IMAGES;

const ArticleCarousel = ({
  quantity = 10,
  lang,
}: {
  quantity?: number;
  lang: ELanguage;
}) => {
  const [articles, setArticles] = useState<IArticleCarousel[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  //   const controls = useAnimation();

  useEffect(() => {
    const setCarousel = async () => {
      const news = await getArticlesForCarousel({
        quantity: quantity,
        lang: lang,
      });

      setArticles(news);
    };

    setCarousel();
  }, []);

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    setDragStart(e.clientX);
  };

  const handleDragEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dragDistance = e.clientX - dragStart;
    if (Math.abs(dragDistance) > 50) {
      // Реалізуйте лівий чи правий свайп
    }
    setDragging(false);
  };

  //   const handleHoverStart = async () => {
  //     await controls.stop(); // Зупинити анімацію
  //   };

  //   const handleHoverEnd = async () => {
  //     await controls.start({
  //       x: ['0%', '-100%'],
  //       transition: { duration: 10, repeat: Infinity, ease: 'linear' },
  //     });
  //   };

  //   useEffect(() => {
  //     if (articles.length > 0) {
  //       handleHoverEnd();
  //     }
  //   }, [articles]);

  return articles.length > 0 ? (
    //   (
    //     <div className="relative overflow-hidden w-full max-w-screen-lg mx-auto">
    //       <motion.div
    //         className="flex space-x-4"
    //         animate={controls}
    //         onHoverStart={handleHoverStart}
    //         onHoverEnd={handleHoverEnd}
    //         drag="x"
    //         dragConstraints={{ left: -1000, right: 0 }} // Можливість прокрутки мишкою
    //       >
    //         {articles.map((article) => (
    //           <div key={article.id} className="flex-none w-64">
    //             <SeoLink
    //               href={`/${lang}/${EUrlBaseParam.ARTICLE}/${article.cpu}`}
    //               title={getSeoCardLinkTitle(article.title)[lang]}
    //             >
    //               {/* <img
    //                 src={`${article.cpu}.jpg`}
    //                 alt={
    //                   ARTICLE_CARD_IMAGES.articleBigImg.getAlt(article.title)[lang]
    //                 }
    //                 className="w-full h-40 object-cover rounded-lg"
    //               /> */}
    //               <Image
    //                 className="my-4 mx-auto sm:border-2 border-white sm:shadow-md rounded"
    //                 src={`${articleBigImg.params.path}${article.cpu}.jpg`}
    //                 alt={articleBigImg.getAlt(article.title)[lang]}
    //                 width={200}
    //                 height={40}
    //                 placeholder="blur"
    //                 blurDataURL={IMG_PROPERTIES.defaultImgBlur}
    //               />
    //               <h3 className="text-center mt-2">{article.title}</h3>
    //             </SeoLink>
    //           </div>
    //         ))}
    //       </motion.div>
    //     </div>
    //   )

    <div
      className="relative overflow-hidden w-full h-64"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onPointerDown={handleDragStart}
      onPointerUp={handleDragEnd}
    >
      <motion.div
        className="flex space-x-4"
        initial={{ x: 0 }}
        animate={{ x: isPaused ? 0 : '-100%' }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: articles.length * 2,
        }}
      >
        {articles.concat(articles).map((article, index) => (
          <div
            key={index}
            className="min-w-[200px] flex-shrink-0 bg-white shadow-md rounded-lg"
          >
            {/* <img
              src={article.image}
              alt={article.title}
              className="w-full h-40 object-cover rounded-t-lg"
            /> */}
            <Image
              className="my-4 mx-auto sm:border-2 border-white sm:shadow-md rounded"
              src={`${articleBigImg.params.path}${article.cpu}.jpg`}
              alt={articleBigImg.getAlt(article.title)[lang]}
              width={200}
              height={40}
              placeholder="blur"
              blurDataURL={IMG_PROPERTIES.defaultImgBlur}
            />
            <div className="p-2">
              <h3 className="text-sm font-bold">{article.title}</h3>
              {/* <h3 className="text-center mt-2">{article.title}</h3> */}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  ) : null;
};

export default ArticleCarousel;
