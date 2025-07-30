// import { parseTransNews } from './libs/parseTransNews.controller.mjs';
import { parseTransNewsForum } from './libs/parseTransNewsForum.controller.mjs';
// if https://www.satsupreme.com/ is not available, add https://www.sat-universe.com/
// import { parseTransNewsForum as parseTransNewsForumSatUniverse } from './libs/parseTransNewsForumSatUniverse.controller.mjs';

const R_U_N = async () => {
  const PARSED_UPDATES = 6;

  // parseTransNewsForumSatUniverse(PARSED_UPDATES);

  parseTransNewsForum(PARSED_UPDATES);

  // parseTransNews(PARSED_UPDATES);
};

R_U_N();
