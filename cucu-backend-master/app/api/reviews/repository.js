const Base = require('../base.repository');
const Review = require('./entity');

const fields = [
  'deleted',
  'grade',
  'date',
  'deleted',
  'translator_id',
  'client_id',
  'service_id', 
  'description',
  'approved'
];

class Repository extends Base {
  constructor(props) {
    super(props);
  }

  getModel() {
    return Review;
  }

  getAllReviews() {
    return this.model
      .query()
      .where("deleted", false);
  }

  getReviews(page, page_limit, approved) {
    return this.model
      .query()
      .where("deleted", false)
      .where("approved", approved)
      .orderBy('created_at')
      .page(page-1, page_limit)
  }

  getUserReviews(userId, approved) {
    return this.model
      .query()
      .where("deleted", false)
      .where("approved", approved)
      .where("translator_id", userId)
      .orderBy('created_at', 'desc')
  }


  getReviewsTranslator(page, page_limit, grade, date, translator_id, client_id, service_id, approved) {
    return this.model
      .query()
      .where("deleted", false)
      .where("translator_id", translator_id)
      .where("approved", approved)
      .andWhere(function () {
        if (grade) {
          this.orWhere("grade", grade);
        }
      })
      .andWhere(function () {
        if (date) {
          this.orWhere("date", date);
        }
      })
      .andWhere(function () {
        if (client_id) {
          this.orWhere("client_id", client_id);
        }
      })
      .andWhere(function () {
        if (service_id) {
          this.orWhere("service_id", service_id);
        }
      })
      .orderBy('created_at')
      .page(page-1, page_limit)
  }

  getReviewsClient(page, page_limit, grade, date, translator_id, client_id, service_id, approved) {
    return this.model
      .query()
      .where("deleted", false)
      .where("client_id", client_id)
      .where("approved", approved)
      .andWhere(function () {
        if (grade) {
          this.orWhere("grade", grade);
        }
      })
      .andWhere(function () {
        if (date) {
          this.orWhere("date", date);
        }
      })
      .andWhere(function () {
        if (translator_id) {
          this.orWhere("translator_id", translator_id);
        }
      })
      .andWhere(function () {
        if (service_id) {
          this.orWhere("service_id", service_id);
        }
      })
      .orderBy('created_at')
      .page(page-1, page_limit)
  }

}

module.exports = new Repository(fields);
