const path = require('path');

module.exports = {
  // Перевірка типів TypeScript
  '**/*.(ts|tsx)': () => 'pnpm tsc --noEmit', // Замінено yarn на pnpm

  // Форматування коду за допомогою Prettier
  '**/*.(ts|tsx|js|scss|css|md|json)': (filenames) => [
    // Об'єднав правила для Prettier
    `pnpm prettier --write ${filenames.join(' ')}`, // Замінено yarn на pnpm
  ],

  // Линтинг та виправлення коду за допомогою ESLint (через Next.js lint)
  '**/*.(ts|tsx|js)': (filenames) =>
    `pnpm next lint --fix --file ${filenames // Замінено yarn на pnpm (якщо next запускається через pnpm)
      .map((f) => path.relative(process.cwd(), f))
      .join(' --file ')}`,
};
