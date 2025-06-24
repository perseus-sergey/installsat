// import { parseTransNews } from './libs/parseTransNews.controller.mjs';
// import { parseTransNewsForum } from './libs/parseTransNewsForum.controller.mjs';
import { parseTransNewsForum } from './libs/parseTransNewsForumSatUniverse.controller.mjs';

const R_U_N = async () => {
  const PARSED_UPDATES = 6;

  parseTransNewsForum(PARSED_UPDATES);
  // parseTransNews(PARSED_UPDATES);
};

R_U_N();
