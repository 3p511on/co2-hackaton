'use strict';

const chalk = require('chalk');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');

const Route = require('../structures/Route');
const FileUtils = require('../utils/FileUtils');

const { COOKIE_SECRET } = process.env;

module.exports = class HTTPLoader {
  constructor(mainApp) {
    this.mainApp = mainApp;
    this.httpServer = null;
    this.httpRoutes = [];
  }

  initialize(port = process.env.PORT || 3000) {
    this.app = express();

    this.app.set('views', './src/views');
    this.app.set('view engine', 'ejs');

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static('public'));
    this.app.use(cookieParser(COOKIE_SECRET));

    this.app.use((req, res, next) => {
      Object.assign(req, { database: this.mainApp.database });
      next();
    });

    this.app.use(
      morgan(
        `${chalk.cyan('[HTTP]')} ${chalk.green(
          // eslint-disable-next-line max-len
          ':method :url - IP :remote-addr - Код :status - Размер :res[content-length] B - Обработано за :response-time ms',
        )}`,
      ),
    );

    this.loadRoutes();

    this.app.listen(port, () =>
      console.log(chalk.cyan('[HTTP]'), chalk.greenBright(`HTTP сервис успешно запущен на порту ${chalk.bold(port)}`)),
    );
  }

  /**
   * @param {string} dirPath - Путь к папке маршрутов
   * @returns {any}
   */
  loadRoutes(dirPath = 'src/routes') {
    let success = 0;
    let failed = 0;
    return FileUtils.requireDirectory(dirPath, NewRoute => {
      if (Object.getPrototypeOf(NewRoute) !== Route) return;
      // eslint-disable-next-line no-unused-expressions
      this.addRoute(new NewRoute()) ? success++ : failed++;
    }).then(() => {
      if (failed) {
        console.error(
          chalk.redBright('[Ошибка]'),
          chalk.red(`При загрузке ${chalk.bold(failed)} маршрутов произошла ошибка `),
        );
      }
      console.log(chalk.cyan('[Маршруты]'), chalk.green(`Загружено успешно ${chalk.bold(success)} маршрутов`));

      this.app.use((req, res) => res.status(404).send({ success: false, cause: 'Страница не найдена' }));
    });
  }

  /**
   * @param {Route} route - Маршрут, который необходимо зарегестрировать
   * @returns {boolean}
   */
  addRoute(route) {
    if (!(route instanceof Route)) {
      console.error(
        chalk.redBright('[Ошибка]'),
        chalk.red(`Произошла ошибка при загрузке ${route}: не является инстансом Route`),
      );
      return false;
    }

    route._register(this.app);
    this.httpRoutes.push(route);
    return true;
  }
};
