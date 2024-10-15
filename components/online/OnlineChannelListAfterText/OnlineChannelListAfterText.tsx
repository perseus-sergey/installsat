import { ELanguage } from '@/models/language.model';

const OnlineChannelListAfterText = ({ lang }: { lang: ELanguage }) =>
  lang === ELanguage.UA ? (
    <section className="p-4">
      <p>
        <strong>Онлайн телебачення</strong> наразі піднімається на новий рівень
        розвитку. Те, що ще недавно здавалося новацією, інтернет-телебачення
        набуває неймовірних масштабів. Глядачів приваблює великий вибір
        можливостей використання телевізійного контенту, які до останнього часу
        були практично неможливі на традиційному телебаченні.
      </p>
      <p>
        {`Поява сучасного Онлайн ТВ відкриває можливість дивитися найпопулярніші
        телевізійні канали на екрані сучасних телевізорів і моніторів
        комп'ютерів у відмінній якості, при цьому не підключаючи жодних
        телевізійних антен.`}
      </p>
      <p>
        На сьогоднішній день високошвидкісний інтернет підкорює все більшу
        територію, що дозволяє майже кожному користувачеві мережі насолодитися
        зручним і якісним телебаченням на будь-який смак.
      </p>
      <p>
        На нашому сайті ви знайдете багато цікавих онлайн-каналів, що
        транслюються безкоштовно.
      </p>
    </section>
  ) : (
    <section className="p-4">
      <p>
        <strong>Online television</strong> is now reaching a new level of
        development. What seemed like a novelty until recently, internet
        television is gaining incredible proportions. Viewers are attracted by
        the wide range of possibilities for using television content, which
        until recently was practically impossible on traditional television.
      </p>
      <p>
        The emergence of modern Online TV opens up the opportunity to watch the
        most popular television channels on the screens of modern televisions
        and computer monitors in excellent quality, without connecting any
        television antennas.
      </p>
      <p>
        Today, high-speed internet is conquering more and more territory,
        allowing almost every network user to enjoy convenient and high-quality
        television for every taste.
      </p>
      <p>
        On our website, you will find many interesting online channels that are
        broadcast for free.
      </p>
    </section>
  );

export default OnlineChannelListAfterText;
