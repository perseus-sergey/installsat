import { parseTransNews } from './libs/parseTransNews.controller.mjs';

const R_U_N = async () => {
  const PARSED_UPDATES = 4;

  parseTransNews(PARSED_UPDATES);
};

R_U_N();
