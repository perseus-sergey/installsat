import { cutText } from '@/libs/utils/utils';
import { ELanguage } from './ui.model';
import { z } from 'zod';

export interface IChannel {
  id: number;
  title: string;
  chan_slug: string;
  logo: string;
  description: string;
  text: string;
  cat_id: number;
  url: string;
  view: number;
  canonical: string;
  tvforsite_net: string;
  freq: number;
  sr: number;
  fec: string;
  polar: string;
  sat_title: string;
  sat_slug: string;
  encryption: string;
  genre: string;
  compression: string;
  cat_title: string;
  cat_slug: string;
  cat_parent_id: number;
  cat_parent_title: string;
  cat_parent_cpu: string;
  chan_lang: string;
}

export interface IOnlineChannel extends IChannel {
  vsetv: number;
  vipiko: number;
  programma: string;
  telegid_id: number;
  aspect: string;
  no_googlads: string;
  potok: string;
  other_stream: string;
  genre_id: number;
  country: string;
}

export interface IChannelCategory {
  id: number;
  title: string;
  parent: number;
  cpu: string;
}

// $beam = explode("|", $beam)[0];
//   if (isset($title) && isset($cpu) && isset($description) && isset($cat1) && isset($sat) && isset($tema) && isset($compress) && isset($lang)){
// 	if ($chb_old_new == 1)
// 		$cat_fill="";
// 	elseif ($chb_old_new == 0)
// 		$cat_fill=",cat='$cat2'";
// 	if ($chb_sat == 1){
// 		$sat_fill=""; $freq_fill="";$beam_fill="";
// 	}
// 	elseif ($chb_sat == 0){
// 		$sat_fill=",sat='$sat'"; $freq_fill=",frequency='$frequency'"; $beam_fill=",beam='$beam'";
// 	}
// 	add_to_db ("
// 	UPDATE $tbl SET title='$title',cpu='$cpu',description='$description',text='$text',
// 	tema='$tema',compress='$compress',lang='$lang',logo='$logo',url='$url',biss='$biss',country_id='$country_id',ip_deny='$ip_deny',
// 	no_googlads='$noGoogAds',
// 	encryption='$encryption',canonical='$canonical',programma='$programma',telegid_id='$telegid_id',vsetv='$vsetv',vipiko='$vipiko',potok='$potok',pars_uppod='$pars_uppod',pattern='$pattern',
// 	tvforsite_net='$tvforsite_net',simpletv='$simpletv',tvforsite_ru='$tvforsite_ru',other_stream='$other_stream',
// 	mark='$mark',aspect='$aspect'
// 	$cat_fill$sat_fill$freq_fill$beam_fill
// 	WHERE id='$id'");

// 	$updateText = "";
// 	  if ($chb_logo) {
// 		  $updateText .= " `logo`='$logo'";
// 	  }
// 	  if ($chb_title) {
// 		  $updateText .= ", `title`='$title'";
// 	  }
// 	  if ($chb_canonical) {
// 		  $updateText .= ", `canonical`='$canonical'";
// 	  }
// 	  if ($chb_description) {
// 		  $updateText .= ", `description`='$description'";
// 	  }
// 	  if ($chb_text) {
// 		  $updateText .= ", `text`='$text'";
// 	  }
// 	  if ($chb_tema) {
// 		  $updateText .= ", `tema`='$tema'";
// 	  }
// 	  if ($chb_lang) {
// 		  $updateText .= ", `lang`='$lang'";
// 	  }
// 	  if ($chb_url) {
// 		  $updateText .= ", `url`='$url'";
// 	  }
// 	  if ($chb_tvforsite_net) {
// 		  $updateText .= ", `tvforsite_net`='$tvforsite_net'";
// 	  }
// 	  if ($chb_mark) {
// 		  $updateText .= ", `mark`='$mark'";
// 	  }
// 	  $updateText = trim($updateText, " ,");

// 	  if ($updateText != "") {
// 		$canon = ($chb_canonical) ? $chb_canonical : $canonical;
// 		echo $ask = "
// 		UPDATE $tbl SET $updateText
// 		WHERE `canonical` = '$canon'
// 		";
// 		add_to_db ($ask);
// 	  }

// 	  $updateText = "";
// 	  if ($chb_vsetv) {
// 		  $updateText .= ", `vsetv`='$vsetv'";
// 	  }
// 	  if ($chb_vipiko) {
// 		  $updateText .= ", `vipiko`='$vipiko'";
// 	  }
// 	  $updateText = trim($updateText, " ,");
// 	  if ($updateText != "") {
// 		echo $ask = "
// 		UPDATE $tbl SET $updateText
// 		WHERE `title` = '$title'
// 		";
// 		add_to_db ($ask);
// 	  }

export enum EChannelEditFields {
  title = 'title',
  logo = 'logo',
  chan_slug = 'chan_slug',
  description = 'description',
  text = 'text',
  cat_id = 'cat_id',
  parent_cat_id = 'parent_cat_id',
  canonical = 'canonical',
  sat_id = 'sat_id',
  frequency_id = 'frequency_id',
  beam_id = 'beam_id',
  genre_id = 'genre_id',
  lang_id = 'lang_id',
  compress_id = 'compress_id',
  country_id = 'country_id',
  url = 'url',
  biss = 'biss',
  ip_deny = 'ip_deny',
  no_googlads = 'no_googlads',
  encryption_id = 'encryption_id',
  vsetv = 'vsetv',
  vipiko = 'vipiko',
  potok = 'potok',
  pars_uppod = 'pars_uppod',
  pattern = 'pattern',
  tvforsite_net = 'tvforsite_net',
  other_stream = 'other_stream',
  mark = 'mark',
}
//   if (isset($title) && isset($cpu) && isset($description) && isset($cat1) && isset($sat) && isset($tema) && isset($compress) && isset($lang)){

export const editChannelSchema = z.object({
  [EChannelEditFields.title]: z.string().min(2).trim(),
  [EChannelEditFields.chan_slug]: z.string().min(2).trim(),
  [EChannelEditFields.description]: z.string().min(2).trim(),
  [EChannelEditFields.text]: z.string().min(2).trim(),

  //   [EChannelEditFields.cat_id]: z.number().min(1).minValue(1),
  [EChannelEditFields.cat_id]: z.coerce
    .number()
    .min(1, 'Choose relative category'),

  [EChannelEditFields.canonical]: z.string().min(2).trim(),
  [EChannelEditFields.genre_id]: z.coerce.number(),
  [EChannelEditFields.lang_id]: z.coerce.number(),
  [EChannelEditFields.compress_id]: z.coerce.number(),
  [EChannelEditFields.country_id]: z.coerce.number(),
  [EChannelEditFields.no_googlads]: z.coerce.number(),

  [EChannelEditFields.parent_cat_id]: z.coerce.number().optional(),
  [EChannelEditFields.sat_id]: z.coerce
    .number({ message: 'Satellite should be number!' })
    .optional(),
  [EChannelEditFields.frequency_id]: z.coerce
    .number({ message: 'Frequency should be number!' })
    .optional(),
  [EChannelEditFields.beam_id]: z.coerce
    .number({ message: 'Beam should be number!' })
    .optional(),
  [EChannelEditFields.ip_deny]: z.coerce.number().optional(),
  [EChannelEditFields.encryption_id]: z.coerce.number().optional(),
  [EChannelEditFields.vsetv]: z.coerce.number().optional(),
  [EChannelEditFields.vipiko]: z.coerce.number().optional(),

  [EChannelEditFields.logo]: z.string().trim().optional(),
  [EChannelEditFields.url]: z.string().trim().optional(),
  [EChannelEditFields.biss]: z.string().trim().optional(),
  [EChannelEditFields.potok]: z.string().min(2).trim().optional(),
  [EChannelEditFields.pars_uppod]: z.string().min(2).trim().optional(),
  [EChannelEditFields.pattern]: z.string().min(2).trim().optional(),
  [EChannelEditFields.tvforsite_net]: z.string().min(2).trim().optional(),
  [EChannelEditFields.other_stream]: z.string().min(2).trim().optional(),
  [EChannelEditFields.mark]: z.string().trim().optional(),
});
export type TChannelEditModel = z.infer<typeof editChannelSchema>;

export interface ISimilarChannel {
  id: number;
  compress: number;
  cpu: string;
  cat_id: number;
  cat_title: string;
  cat_cpu: string;
  cat_parent_id: number;
  sat_title: string;
  sat_cpu: string;
  sat_position: number;
  freq: number;
  cat_parent_title: string;
  cat_parent_cpu: string;
}

export const META_CHANNEL = {
  getH1(satTitle: string) {
    return {
      [ELanguage.UA]: `Безкоштовні канали з супутника ${satTitle}`,
      [ELanguage.EN]: `Free satellite channels on ${satTitle}`,
    };
  },
  getTitle() {
    return {
      [ELanguage.UA]: 'Список каналів супутника',
      [ELanguage.EN]: 'List of satellite channels',
    };
  },
  titleBefore: {
    [ELanguage.UA]: `Канал`,
    [ELanguage.EN]: `Channel`,
  },
  keywordsBefore: {
    [ELanguage.UA]: `Телевізійний канал `,
    [ELanguage.EN]: `Television channel `,
  },
  scheduleLinkText: {
    channel: {
      [ELanguage.UA]: 'Телепрограма на',
      [ELanguage.EN]: 'TV Schedule for',
    },
    onlineChannel: {
      [ELanguage.UA]: 'Повна програма',
      [ELanguage.EN]: 'Full Schedule',
    },
  },
  getOnlineLinkText(channelTitle: string) {
    return {
      [ELanguage.UA]: `Канал "${channelTitle}" онлайн`,
      [ELanguage.EN]: `Channel "${channelTitle}" online`,
    };
  },
  images: {
    defaultImgBlur: '/Images/1blur.gif',
    channelLogo: {
      big: {
        path: '/Images/channelsOptimized/',
        height: 99,
        width: 132,
        alternativeImgStr: { title: '🎞', fontSize: '6rem' },
        defaultImage: {
          src: '/Images/1not_found_chan.png',
          height: 99,
          width: 132,
        },
        alt: {
          [ELanguage.UA]: `Логотип каналу`,
          [ELanguage.EN]: `Logo of the channel`,
        },
      },
      small: {
        path: '/Images/channel_55/',
        height: 42,
        width: 55,
        alternativeImgStr: { title: '🎞', fontSize: '2rem' },
        defaultImage: {
          src: '/Images/1not_found_chan.png',
          height: 42,
          width: 55,
        },
      },
    },
    scheduleImg: {
      src: '/Images/schedule-icon96.png',
      height: 96,
      width: 96,
      alternativeImgStr: { title: '📋', fontSize: '6rem' },
      alt: {
        [ELanguage.UA]: `Перегляд розкладу телепередач`,
        [ELanguage.EN]: `View TV schedules`,
      },
    },
    onlineLinkImg: {
      src: '/Images/network-wireless_32.png',
      height: 32,
      width: 32,
      alternativeImgStr: { title: '📺', fontSize: '2rem' },
      alt: {
        [ELanguage.UA]: `Перехід до онлайн ТБ сторінки`,
        [ELanguage.EN]: `Go to the online TV page`,
      },
    },
  },
  chanParamsBlock: {
    getParamsTitle(channelTitle: string) {
      return {
        [ELanguage.UA]: `Параметри мовлення каналу "${channelTitle}"`,
        [ELanguage.EN]: `Broadcast options for channel "${channelTitle}"`,
      };
    },
    paramsLanguage: {
      [ELanguage.UA]: `Мова мовлення (перекладу) : `,
      [ELanguage.EN]: `Broadcast (translation) language : `,
    },
    paramsFormat: {
      [ELanguage.UA]: `Формат мовлення : `,
      [ELanguage.EN]: `Broadcast format : `,
    },
    paramsSatellite: {
      [ELanguage.UA]: `Супутник : `,
      [ELanguage.EN]: `Satellite : `,
    },
    paramsFrequency: {
      [ELanguage.UA]: `Частота : `,
      [ELanguage.EN]: `Frequency : `,
    },
    paramsFEC: {
      [ELanguage.UA]: `FEC : `,
      [ELanguage.EN]: `FEC : `,
    },
    paramsEncryption: {
      [ELanguage.UA]: `Шифрування : `,
      [ELanguage.EN]: `Encryption : `,
    },
    getParamsSite(channelTitle: string) {
      return {
        [ELanguage.UA]: `Сайт каналу "${channelTitle}"`,
        [ELanguage.EN]: `Channel website "${channelTitle}"`,
      };
    },
  },
  noteTitle: {
    [ELanguage.UA]: 'Примітка',
    [ELanguage.EN]: 'Note',
  },
  getResponsibilityText(channelTitle: string) {
    return {
      [ELanguage.UA]: `Шановні відвідувачі, ми не є власниками телеканалу «${channelTitle}». Ми не несемо відповідальності за трансльовані передачі та проблеми мовлення каналу.`,
      [ELanguage.EN]: `Dear visitors, we are not the owners of the «${channelTitle}» channel. We are not responsible for broadcast programs and channel broadcast problems.`,
    };
  },
  infoPanelTitles: {
    package: { [ELanguage.UA]: 'Пакет', [ELanguage.EN]: 'Package' },
    views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
    comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
  },
  similar: {
    channels: {
      title: {
        [ELanguage.UA]: 'Де дивитись',
        [ELanguage.EN]: 'Where to watch',
      },
      getOnlineChannelTitle(channelTitle: string) {
        return {
          [ELanguage.UA]: `Дивитись канал "${channelTitle}" у прямому ефірі онлайн`,
          [ELanguage.EN]: `Watch the channel "${channelTitle}" live online`,
        };
      },
      getSatChannelTitle(satTitle: string, satPosition: number) {
        return {
          [ELanguage.UA]: `Супутник: ${satTitle} ${satPosition}`,
          [ELanguage.EN]: `Satellite: ${satTitle} ${satPosition}`,
        };
      },
      getFrequencyTitle(frequency: number) {
        return {
          [ELanguage.UA]: `| Частота: ${frequency}`,
          [ELanguage.EN]: `| Frequency: ${frequency}`,
        };
      },
      packageTitle: {
        [ELanguage.UA]: 'Пакет:',
        [ELanguage.EN]: 'Package:',
      },
    },
    articles: {
      title: {
        [ELanguage.UA]: 'Новини каналу:',
        [ELanguage.EN]: 'Channel news:',
      },
    },
  },
};

export const META_CHANNEL_ONLINE = {
  getTitle(channelTitle: string) {
    return {
      [ELanguage.UA]: `${channelTitle} онлайн`,
      [ELanguage.EN]: `${channelTitle} online`,
    };
  },
  getH1(channelTitle: string) {
    return {
      [ELanguage.UA]: `Канал «${channelTitle}» онлайн`,
      [ELanguage.EN]: `${channelTitle} channel online`,
    };
  },
  getDescription(channelTitle: string, description: string) {
    return {
      [ELanguage.UA]: `Дивіться онлайн канал ${channelTitle} безкоштовно у прямому ефірі. ${cutText(description, 120)}`,
      [ELanguage.EN]: `Watch the online channel ${channelTitle} for free live.  ${cutText(description, 120)}`,
    };
  },
  getKeywords(channelTitle: string) {
    return {
      [ELanguage.UA]: `${channelTitle} дивитись, онлайн, online, безкоштовно, тб, канал, прямий ефір, інтернет тб`,
      [ELanguage.EN]: `${channelTitle} watch, online, free, live, tv, channel, satellite, internet tv`,
    };
  },
  fakePlayer: {
    button: {
      ariaLabel: {
        [ELanguage.UA]: 'Перейти до перегляду',
        [ELanguage.EN]: 'Go to playback',
      },
      titleStart: {
        [ELanguage.UA]: 'Дивитись онлайн',
        [ELanguage.EN]: 'Watch online',
      },
    },
    getCopyrightText(chanTitle: string) {
      return {
        [ELanguage.UA]: `Онлайн трансляція телеканалу ${chanTitle} призупинена за вимогою власника
        авторських прав.`,
        [ELanguage.EN]: `The online broadcast of the ${chanTitle} channel has been suspended due to the owner's
        copyrights.`,
      };
    },
    openNewWindowFeatures:
      'left=0,top=0,width=665,height=550,status=no,toolbar=yes,menubar=no,scrollbars=yes',
  },
  youtubePlayer: {
    width: 700,
    height: 395,
    embedPath: 'https://www.youtube.com/embed/',
  },
  tabs: {
    button: {
      getAriaLabel(streamNumber: number) {
        return {
          [ELanguage.UA]: `Дивитись із ${streamNumber}-го Джерела`,
          [ELanguage.EN]: `Watch from ${streamNumber} source`,
        };
      },
      getTitle(streamNumber: number) {
        return {
          [ELanguage.UA]: `${streamNumber} Канал`,
          [ELanguage.EN]: `Channel ${streamNumber}`,
        };
      },
    },
  },
};
