import { ELanguage } from '@/models/language.model';

const OnlineChannelListAfterText = ({ lang }: { lang: ELanguage }) => {
  const content = {
    [ELanguage.UA]: (
      <>
        <p>
          <strong>Онлайн телебачення</strong> наразі піднімається на новий
          рівень розвитку. Те, що ще недавно здавалося новацією,
          інтернет-телебачення набуває неймовірних масштабів. Глядачів приваблює
          великий вибір можливостей використання телевізійного контенту, які до
          останнього часу були практично неможливі на традиційному телебаченні.
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
      </>
    ),
    [ELanguage.EN]: (
      <>
        <p>
          <strong>Online television</strong> is now reaching a new level of
          development. What seemed like a novelty until recently, internet
          television is gaining incredible proportions. Viewers are attracted by
          the wide range of possibilities for using television content, which
          until recently was practically impossible on traditional television.
        </p>
        <p>
          The emergence of modern Online TV opens up the opportunity to watch
          the most popular television channels on the screens of modern
          televisions and computer monitors in excellent quality, without
          connecting any television antennas.
        </p>
        <p>
          Today, high-speed internet is conquering more and more territory,
          allowing almost every network user to enjoy convenient and
          high-quality television for every taste.
        </p>
        <p>
          On our website, you will find many interesting online channels that
          are broadcast for free.
        </p>
      </>
    ),
    [ELanguage.RU]: (
      <>
        <p>
          <strong>Онлайн телевидение</strong> сейчас достигает нового уровня
          развития. То, что до недавнего времени казалось новшеством, интернет-
          телевидение приобретает невероятные масштабы. Зрителей привлекает
          широкий выбор возможностей использования телевизионного контента,
          который до недавнего времени был практически невозможен на
          традиционном телевидении.
        </p>
        <p>
          Появление современного Онлайн ТВ открывает возможность смотреть самые
          популярные телевизионные каналы на экранах современных телевизоров и
          компьютерных мониторов в отличном качестве, не подключая никаких
          телевизионных антенн.
        </p>
        <p>
          Сегодня высокоскоростной интернет завоевывает все большую территорию,
          что позволяет почти каждому пользователю сети наслаждаться удобным и
          качественным телевидением на любой вкус.
        </p>
        <p>
          На нашем сайте вы найдете много интересных онлайн-каналов, которые
          транслируются бесплатно.
        </p>
      </>
    ),
    [ELanguage.ES]: (
      <>
        <p>
          <strong>La televisión en línea</strong> ahora está alcanzando un nuevo
          nivel de desarrollo. Lo que hasta hace poco parecía una novedad, la
          televisión por Internet está ganando proporciones increíbles. A los
          espectadores les atrae la amplia gama de posibilidades para utilizar
          el contenido televisivo, que hasta hace poco era prácticamente
          imposible en la televisión tradicional.
        </p>
        <p>
          La aparición de la televisión en línea moderna abre la oportunidad de
          ver los canales de televisión más populares en las pantallas de los
          televisores modernos y monitores de computadora en excelente calidad,
          sin conectar antenas de televisión.
        </p>
        <p>
          Hoy en día, Internet de alta velocidad está conquistando cada vez más
          territorio, lo que permite a casi todos los usuarios de la red
          disfrutar de una televisión conveniente y de alta calidad para todos
          los gustos.
        </p>
        <p>
          En nuestro sitio web, encontrará muchos canales en línea interesantes
          que se transmiten de forma gratuita.
        </p>
      </>
    ),
    [ELanguage.AR]: (
      <>
        <p>
          <strong>التلفزيون عبر الإنترنت</strong> الآن يصل إلى مستوى جديد من
          التطور. ما بدا وكأنه مبتكر حتى وقت قريب، أصبح التلفزيون عبر الإنترنت
          يكتسب أبعادًا مذهلة. يجذب المشاهدين مجموعة واسعة من الاحتمالات
          لاستخدام محتوى التلفزيون، وهو ما كان حتى وقت قريب مستحيلًا عمليًا على
          التلفزيون التقليدي.
        </p>
        <p>
          يفتح ظهور التلفزيون عبر الإنترنت الحديث الفرصة لمشاهدة أشهر قنوات
          التلفزيون على شاشات التلفزيونات الحديثة وشاشات الكمبيوتر بجودة ممتازة،
          دون توصيل أي هوائيات تلفزيونية.
        </p>
        <p>
          اليوم، يتفوق الإنترنت عالي السرعة على المزيد والمزيد من المناطق، مما
          يسمح تقريبًا لكل مستخدم للشبكة بالاستمتاع بتلفزيون مريح وعالي الجودة
          لكل ذوق.
        </p>
        <p>
          على موقعنا، ستجد العديد من القنوات المثيرة للاهتمام التي يتم بثها
          مجانًا.
        </p>
      </>
    ),
    [ELanguage.DE]: (
      <>
        <p>
          <strong>Online-Fernsehen</strong> erreicht jetzt ein neues
          Entwicklungsniveau. Was bis vor kurzem noch neu war, gewinnt das
          Internetfernsehen an unglaublichem Ausmaß. Zuschauer werden von der
          breiten Palette an Möglichkeiten angezogen, Fernsehinhalte zu nutzen,
          die bis vor kurzem praktisch unmöglich im traditionellen Fernsehen
          waren.
        </p>
        <p>
          Das Aufkommen des modernen Online-TV eröffnet die Möglichkeit, die
          beliebtesten Fernsehsender auf den Bildschirmen moderner Fernseher und
          Computerbildschirme in ausgezeichneter Qualität zu sehen, ohne
          Fernsehanlagen anzuschließen.
        </p>
        <p>
          Heute erobert das Hochgeschwindigkeitsinternet immer mehr Gebiete, was
          es fast jedem Nutzer des Netzwerks ermöglicht, bequemes und qualitativ
          hochwertiges Fernsehen für jeden Geschmack zu genießen.
        </p>
        <p>
          Auf unserer Website finden Sie viele interessante Online-Kanäle, die
          kostenlos ausgestrahlt werden.
        </p>
      </>
    ),
    [ELanguage.FR]: (
      <>
        <p>
          <strong>Télévision en ligne</strong> atteint maintenant un nouveau
          niveau de développement. Ce qui semblait être une nouveauté
          jusqu&apos;à récemment, la télévision par Internet prend des
          proportions incroyables. Les téléspectateurs sont attirés par la
          grande variété de possibilités d&apos;utilisation du contenu
          télévisuel, qui jusqu&apos;à récemment était pratiquement impossible à
          la télévision traditionnelle.
        </p>
        <p>
          L&apos;émergence de la télévision en ligne moderne ouvre la
          possibilité de regarder les chaînes de télévision les plus populaires
          sur les écrans des téléviseurs modernes et des moniteurs
          d&apos;ordinateur dans une excellente qualité, sans connecter
          d&apos;antenne de télévision.
        </p>
        <p>
          Aujourd&apos;hui, l&apos;internet haut débit conquiert de plus en plus
          de territoires, permettant à presque tous les utilisateurs du réseau
          de profiter d&apos;une télévision pratique et de haute qualité pour
          tous les goûts.
        </p>
        <p>
          Sur notre site Web, vous trouverez de nombreuses chaînes en ligne
          intéressantes qui sont diffusées gratuitement.
        </p>
      </>
    ),
    [ELanguage.IT]: (
      <>
        <p>
          <strong>La televisione online</strong> sta ora raggiungendo un nuovo
          livello di sviluppo. Quello che sembrava una novità fino a poco tempo
          fa, la televisione su Internet sta acquisendo proporzioni incredibili.
          Gli spettatori sono attratti dalla vasta gamma di possibilità per
          utilizzare i contenuti televisivi, che fino a poco tempo fa erano
          praticamente impossibili sulla televisione tradizionale.
        </p>
        <p>
          L&apos;emergere della TV online moderna apre l&apos;opportunità di
          guardare i canali televisivi più popolari sugli schermi dei moderni
          televisori e monitor per computer in ottima qualità, senza collegare
          antenne televisive.
        </p>
        <p>
          Oggi, Internet ad alta velocità sta conquistando sempre più
          territorio, permettendo a quasi tutti gli utenti della rete di godere
          di una TV comoda e di alta qualità per tutti i gusti.
        </p>
        <p>
          Sul nostro sito troverai molti interessanti canali online che vengono
          trasmessi gratuitamente.
        </p>
      </>
    ),
  };

  return <section className="p-4">{content[lang]}</section>;
};

export default OnlineChannelListAfterText;
