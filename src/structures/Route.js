'use strict';

/**
 * @param {string} name - Название маршрута
 * @param {Route} parent - Родительный маршрут
 */
module.exports = class Route {
  constructor(name, parent) {
    this.name = name;
    this.parentRoute = parent || '';

    this.subRoutes = null;
    this.requirements = null;
  }

  get path() {
    return `${this.parentRoute ? this.parentRoute : ''}/${this.name}`;
  }

  _register(app) {
    if (this.subRoutes) this.subRoutes.forEach(route => route._register(app));
    this.register(app);
  }

  register() {
    throw new Error('Нет кода');
  }
};
