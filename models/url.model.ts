export const SITE_BASE_URL = 'https://www.installsat.tv';

export enum EUrlBaseParam {
  BASE_PATH = '/',
  TRANSPONDER_NEWS = 'transponderni-novyny',
  // SAT_NEWS = 'suputnykovi-novyny',
  PACKAGE_CHANNEL_LIST = 'spysok-kanaliv-paketu',
  SAT_CHANNEL_LIST = 'spysok-kanaliv-suputnyka',
  // ALL_SATS_CHANNEL_LIST = 'vsi-suputnyky',
  INSTALLATION_OPTIONS = 'varianty-vstanovlennia-anten',
  ARTICLE = 'stattia',
  SAT_COVERAGE_MAP = 'mapa-pokryttia-suputnyka',
  NEWS_AND_ARTICLES = 'novyny-ta-statti',
  CHANNEL_PARAMS = 'parametry-kanalu',
  ONLINE_CHANNEL_LIST = 'spysok-online-kanaliv',
  TV_ONLINE = 'tb-online',
  TV_PROGRAM = 'programa-tb',
  CHANNEL_TV_PROGRAM = 'programa-kanalu',
  PRODUCT = 'tovar',
  PRODUCT_LIST = 'spysok-tovariv',
  PRODUCT_CATEGORY = 'kategorija-tovara',
}

export enum EUrlSearchParam {
  SAT = 'sat',
  INTERVAL = 'interval',
}

// -- RewriteRule 	^spisok-kanalov-paketa\/([-a-zA-Z0-9_]+)\/(light\/)?$ 		chan_list.php?category=$1&type=$2 	[QSA,L]
// -- RewriteRule 	^varianty-ustanovki-anten/([-a-zA-Z0-9_]+)/$ 				installations.php?inst=$1 			[QSA,L]
// -- RewriteRule 	^spisok-kanalov-sputnika/([-a-zA-Z0-9_]+)/$ 				chan_list.php?satellite=$1 			[QSA,L]
// -- RewriteRule 	^tv-programma/(vse-kanaly)/$ 								chan_list.php?tvprog=$1				[QSA,L]
// RewriteRule 	^spisok-kanalov-formata/([-a-zA-Z0-9_]+)/$ 					chan_list.php?compression=$1 		[QSA,L]
// -- RewriteRule 	^spisok-online-kanalov/([-a-zA-Z0-9_]+)/$ 					chan_list.php?onlinetv=$1 			[QSA,L]
// -- RewriteRule 	^kategorija-tovara/([-a-zA-Z0-9_]+)/$ 						product_category.php?category=$1 	[QSA,L]
// -- RewriteRule 	^spisok-tovarov/([-a-zA-Z0-9_]+)/$ 							product_list.php?category=$1 		[QSA,L]
// -- RewriteRule 	^statja\/([-a-zA-Z0-9_]+?)\/\??$ 							useful.php?id=$1 					[L]
// -- RewriteRule 	^karta-pokrytija-sputnika/([-a-zA-Z0-9_]+)/$ 				maps.php?cpu=$1 					[QSA,L]
// -- RewriteRule 	^novosti-i-statji/transpondernye-novosti/$  				trans_news_list.php 				[QSA,L]
// -- RewriteRule 	^sputnikovye-novosti/([-0-9_]+)/$ 							trans_news.php?id=$1 				[QSA,L]
// -- RewriteRule 	^novosti-i-statji\/([-a-zA-Z0-9_]+)\/([\d]*)\/?$ 			useful_list.php?cat=$1&page=$2 		[QSA,L]
// -- RewriteRule 	^parametri-kanala/([-a-zA-Z0-9_]+)/$ 						channel.php?id=$1 					[QSA,L]
// -- RewriteRule 	^programma-kanala/([-a-zA-Z0-9_]+)/([-a-zA-Z0-9_]+)/$ 		tvprog.php?id=$1&date=$2 			[QSA,L]
// -- RewriteRule 	^tv-online/([-a-zA-Z0-9_]+)/$ 								online.php?id=$1 					[QSA,L]
// -- RewriteRule 	^tovar/([-a-zA-Z0-9_]+)/$ 									product.php?id=$1 					[QSA,L]
// RewriteRule 	^price/([-a-zA-Z0-9_]+)/$ 									product_price.php?cat=$1 			[QSA,L]
// RewriteRule 	^nashi-kontakty/?$ 											contacts.php 						[QSA,L]
// RewriteRule 	^chat/?$ 											chat/chat.php 						[QSA,L]
