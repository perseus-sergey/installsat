module.exports = {
  apps: [
    {
      name: 'installsat', // Те саме ім'я, що ви хочете використовувати
      script: 'pnpm',
      args: 'start', // Команда, яку передати pnpm (тобто "pnpm start")
      // Або якщо ви запускаєте next start напряму:
      // script : "npx",
      // args   : "next start -p 3000",
      cwd: '.', // Поточна директорія (де знаходиться ecosystem.config.js)
      instances: 1, // Кількість екземплярів (для Next.js зазвичай 1, якщо не використовуєте кластерний режим)
      autorestart: true, // Автоматично перезапускати при падінні
      watch: false, // Не стежити за змінами файлів (це робить ваш деплой-скрипт)
      max_memory_restart: '1G', // Перезапускати, якщо пам'ять перевищує 1ГБ
      env: {
        // Змінні середовища для всіх режимів
        NODE_ENV: 'production',
        PORT: 3000, // Вкажіть тут порт, якщо він не вказаний у команді start
      },
      // env_production: { // Можна визначити окремі змінні для production
      //   NODE_ENV: "production",
      // }
    },
  ],
};
