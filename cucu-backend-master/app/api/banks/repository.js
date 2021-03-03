const Base = require('../base.repository');
const Bank = require('./entity');

const fields = [
  'name',
  'deleted'
];

class Repository extends Base {
  constructor(props) {
    super(props);
  }

  getModel() {
    return Bank;
  }

  getAllBanks() {
    return this.model
      .query()
      .where("deleted", false);
  }

  getBanks(page, page_limit, name) {
    return this.model
      .query()
      .where("deleted", false)
      .andWhere(function () {
        if (name) {
          this.orWhere(raw('lower(unaccent("name"))'), 'like', `%${name}%`);
        }
      })
      .orderBy('created_at')
      .page(page-1, page_limit)
  }
}

module.exports = new Repository(fields);
