const Base = require('../base.repository');
const Department = require('./entity');

const fields = [
  'name',
  'country_id',
  'deleted'
];

class Repository extends Base {
  constructor(props) {
    super(props);
  }

  getModel() {
    return Department;
  }

  getAllDepartments() {
    return this.model
      .query()
      .withGraphFetched('country')
      .where("deleted", false);
  }

  getDepartments(page, page_limit, name) {
    return this.model
      .query()
      .where("deleted", false)
      .withGraphFetched('country')
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
