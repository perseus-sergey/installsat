export const SITE_BASE_URL = 'https://www.1plus2.fun';
export enum ELang {
  en = 'en',
  ua = 'ua',
}

type TLang = {
  [ELang.en]: string;
  [ELang.ua]: string;
};

type TTitleMap = Map<string, TLang>;

export enum EMessageNames {
  'MISSION_CHOICE' = 'choiceMiss',
  'SHOW_END_LEVEL' = 'showEndLevel',
  'CATEGORY_CHOICE' = 'categoryChoice',
  'CHOICE_MAX_EXS_NUM' = 'choiceMaxNumOfExs',
  'LEFT_EXS_NUM_MSG' = 'leftExs',
  'BRAVO' = 'bravo',
  'BAD' = 'bad',
  'NO_BAD' = 'notBad',
  'CORRECTION' = 'correction',
  'CONTINUE' = 'continue',
  'RESULTS' = 'results',
  'EXS_TIME' = 'exTime',
  'CATEGORY' = 'category',
  'MISTAKES' = 'mistakes',
  'BTN_LEVELS' = 'btnLevels',
  'BTN_CAT' = 'btnCat',
  'BTN_ENTER' = 'btnEnter',
  'BTN_MATH' = 'btnMath',
  'TITLE_HOME_PAGE' = 'titleHomePage',
  'TITLE_REPORT' = 'Report',
  'EXERCISES' = 'exercises',
}

export const titleMap: TTitleMap = new Map([
  [EMessageNames.MISSION_CHOICE, { [ELang.en]: 'Choose the task', [ELang.ua]: 'Обери завдання' }],
  [
    EMessageNames.SHOW_END_LEVEL,
    { [ELang.en]: 'level is completed', [ELang.ua]: 'рівень пройдено' },
  ],
  [
    EMessageNames.CATEGORY_CHOICE,
    { [ELang.en]: 'Choose the category', [ELang.ua]: 'Обери категорію' },
  ],
  [
    EMessageNames.CHOICE_MAX_EXS_NUM,
    { [ELang.en]: 'Choose Level', [ELang.ua]: 'Рівень складності' },
  ],
  [EMessageNames.LEFT_EXS_NUM_MSG, { [ELang.en]: 'Remains', [ELang.ua]: 'Залишилось' }],
  [EMessageNames.BRAVO, { [ELang.en]: 'BRAVO', [ELang.ua]: 'БРАВО!' }],
  [EMessageNames.BAD, { [ELang.en]: 'BAD!', [ELang.ua]: 'ПОГАНО!' }],
  [EMessageNames.NO_BAD, { [ELang.en]: 'NOT BAD', [ELang.ua]: 'НОРМАЛЬНО!' }],
  [EMessageNames.CORRECTION, { [ELang.en]: 'Correction', [ELang.ua]: 'Виправлення' }],
  [EMessageNames.CONTINUE, { [ELang.en]: 'Continue', [ELang.ua]: 'Далі' }],
  [EMessageNames.RESULTS, { [ELang.en]: 'Results', [ELang.ua]: 'Результати' }],
  [EMessageNames.EXS_TIME, { [ELang.en]: 'Execution time', [ELang.ua]: 'Час виконання' }],
  [EMessageNames.CATEGORY, { [ELang.en]: 'Category', [ELang.ua]: 'Категорія' }],
  [EMessageNames.MISTAKES, { [ELang.en]: 'Mistakes', [ELang.ua]: 'Помилки' }],
  [EMessageNames.BTN_LEVELS, { [ELang.en]: 'Levels', [ELang.ua]: 'Рівні' }],
  [EMessageNames.BTN_CAT, { [ELang.en]: 'Categories', [ELang.ua]: 'Категорії' }],
  [EMessageNames.BTN_ENTER, { [ELang.en]: 'Confirm', [ELang.ua]: 'Далі' }],
  [EMessageNames.BTN_MATH, { [ELang.en]: 'Maths', [ELang.ua]: 'Математика' }],
  [EMessageNames.TITLE_HOME_PAGE, { [ELang.en]: 'Home Page', [ELang.ua]: 'Домашня Сторінка' }],
  [EMessageNames.TITLE_REPORT, { [ELang.en]: 'Report', [ELang.ua]: 'Звіт' }],
  [EMessageNames.EXERCISES, { [ELang.en]: 'Exercises', [ELang.ua]: 'Завдань' }],
]);

export enum EPageTitles {
  'MAIN' = 'main',
  'MATH' = 'math',
}

export enum EMetaTypes {
  'TITLE' = 'title',
  'DESCRIPTION' = 'description',
  'KEYWORDS' = 'keywords',
}

type TMetaMap = Map<
  EPageTitles,
  {
    [EMetaTypes.TITLE]: TLang;
    [EMetaTypes.DESCRIPTION]: TLang;
    [EMetaTypes.KEYWORDS]: TLang;
  }
>;

export const metaMap: TMetaMap = new Map([
  [
    EPageTitles.MAIN,
    {
      [EMetaTypes.TITLE]: {
        [ELang.en]: '1+2 = Fun',
        [ELang.ua]: '1+2 = Весело',
      },
      [EMetaTypes.DESCRIPTION]: {
        [ELang.en]:
          'Interactive online resource, homework, exams and tests. Useful for teachers, students and parents.',
        [ELang.ua]:
          'Інтерактивний розвиваючий онлайн ресурс, домашні роботи, іспити та тести. Корисно для вчителів, учнів та батьків.',
      },
      [EMetaTypes.KEYWORDS]: {
        [ELang.en]:
          'Interactive, homework, exams, tests, mathematics, children, teachers, students and parents.',
        [ELang.ua]:
          'дитяча математика, рівень, вчимося рахувати, додавання, віднімання, порівняння, більше, менше, дорівнює.',
      },
    },
  ],
  [
    EPageTitles.MATH,
    {
      [EMetaTypes.TITLE]: {
        [ELang.en]: '1+2 | Fun Maths',
        [ELang.ua]: '1+2 | Весела Математика',
      },
      [EMetaTypes.DESCRIPTION]: {
        [ELang.en]:
          "Fun children's mathematics, initial level, learn to count, add, subtract, comparison, more, less, equal.",
        [ELang.ua]:
          'Весела дитяча математика, початковий рівень, вчимося рахувати, додавання, віднімання, порівняння, більше, менше, дорівнює.',
      },
      [EMetaTypes.KEYWORDS]: {
        [ELang.en]:
          'children mathematics, level, learn, count, add, subtract, comparison, more, less, equal.',
        [ELang.ua]:
          'дитяча математика, рівень, вчимося рахувати, додавання, віднімання, порівняння, більше, менше, дорівнює.',
      },
    },
  ],
]);

export const getTitleFromMap = (
  msg: EMessageNames,
  lang: ELang = ELang.en,
  mapTitleObj = titleMap.get(msg)
) => (mapTitleObj ? mapTitleObj[lang] : '');
