const Base = require('../base.repository');
const User = require('./entity');
const { raw } = require('objection');

const fields = [
  'firstname',
  'lastname',
  'password',
  'document',
  'phone',
  'email',
  'role',
  'disabled',
  'deleted',
  'rate_minute',
  'rate_hour',
  'half_day',
  'full_day',
  'rate_page',
  's_rate_min',
  'v_rate_min',
  'sworn',
  'notsworn',
  'simultaneous',
  'consecutive',
  'country_id',
  'city_id',
  'country',
  'city',
  'department_id',
  'address_1',
  'address_2',
  'nationality',
  'description',
  'languages',
  'specialities',
  'certifications',
  'work_experience',
  'image_url',
  'company_name',
  'unavailable',
  'address_additional',
  'approved_translator',
  'remote_tools',
  'translator_services',
  'admin_permissions',
  'created_at',
  'labor_months',
  'stripe_id'
];

class Repository extends Base {
  constructor(props) {
    super(props);
  }

  getModel() {
    return User;
  }

  getUsers(page, page_limit, name, email, disabled, city_id, department_id, country_id ) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'document',
        'phone',
        'email',
        'role',
        'disabled',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'address_1',
        'address_2',
        'nationality',
        'description',
        'languages',
        'specialities',
        'certifications',
        'work_experience',
        'image_url',
        'company_name',
        'unavailable',
        'labor_months',
        'rate_minute',
        'rate_hour',
        'half_day',
        'full_day',
        'rate_page',
        's_rate_min',
        'v_rate_min',
        'sworn',
        'notsworn',
        'simultaneous',
        'consecutive',
      )
      .where("deleted", false)
      .orderBy('created_at')
      .page(page-1, page_limit)
      .andWhere(function () {
        if (name) {
          this.orWhere(raw('lower(unaccent(users."firstname"))'), 'like', `%${name}%`);
          this.orWhere(raw('lower(unaccent(users."lastname"))'), 'like', `%${name}%`);
        }
      })
      .andWhere(function () {
        if (email) {
          this.orWhere(raw('lower(unaccent(users."email"))'), 'like', `%${email}%`);
        }
      })
      .andWhere(function () {
        if (disabled) {
          this.orWhere("disabled", '=', disabled);
        }
      })
      .andWhere(function () {
        if (city_id) {
          this.orWhere('users.city_id', city_id);
        }
      })
      .andWhere(function () {
        if (department_id) {
          this.orWhere('users.department_id', department_id);
        }
      })
      .andWhere(function () {
        if (country_id) {
          this.orWhere('users.country_id', country_id);
        }
      })
  }

  getClients(page, page_limit, name, disabled, sort_by, sort_order) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'document',
        'phone',
        'email',
        'role',
        'disabled',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'address_1',
        'address_2',
        'address_additional',
        'nationality',
        'description',
        'image_url',
        'company_name'
      )
      .where("deleted", false)
      .where("disabled", disabled)
      .page(page-1, page_limit)
      .orderBy(sort_by, sort_order)

      .andWhere(function () {
          this.orWhere("role", 3);
          this.orWhere("role", 4);
      })  

      .andWhere(function () {
        if (name) {
          this.orWhere(raw('lower(unaccent(users."firstname"))'), 'like', `%${name}%`);
          this.orWhere(raw('lower(unaccent(users."lastname"))'), 'like', `%${name}%`);
        }
      })
  }

  getAdmins(page, page_limit, name, disabled, sort_by, sort_order) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'document',
        'phone',
        'email',
        'role',
        'disabled',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'address_1',
        'address_2',
        'address_additional',
        'nationality',
        'description',
        'image_url',
        'admin_permissions',
      )
      .where("deleted", false)
      .where("disabled", disabled)
      .where("role", "1")
      .page(page-1, page_limit)
      .orderBy(sort_by, sort_order)

      .andWhere(function () {
        if (name) {
          this.orWhere(raw('lower(unaccent(users."firstname"))'), 'like', `%${name}%`);
          this.orWhere(raw('lower(unaccent(users."lastname"))'), 'like', `%${name}%`);
        }
      })
  }


  getTranslators(name, speciality_id, translator_service_id, languages, approved_translator, sort_by, sort_order, disabled) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'role',
        'disabled',
        'rate_minute',
        'rate_hour',
        'half_day',
        'full_day',
        'rate_page',
        's_rate_min',
        'v_rate_min',
        'sworn',
        'notsworn',
        'simultaneous',
        'consecutive',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'nationality',
        'languages',
        'certifications',
        'specialities',
        'work_experience',
        'image_url',
        'unavailable',
        'remote_tools',
        'translator_services',
        'labor_months',
        'created_at'
      )
      .where("disabled", disabled)
      .where("deleted", false)
      .where("role", "2")
      .where("approved_translator", approved_translator )
      .orderBy(sort_by, sort_order)


      .andWhere(function () {
        if(speciality_id){
          let parsed = JSON.parse(speciality_id)
          console.log(parsed,"especiality")
          this.whereJsonSupersetOf('specialities', parsed)
        }
      })
      .andWhere(function () {
        if(translator_service_id){
          let parsed = translator_service_id
          console.log(parsed,"service")
          this.whereJsonSupersetOf('translator_services',parsed)
        }
      })
      

      /* .andWhere(function () {
        if(languages){
          let parsed = JSON.parse(languages)
          this.whereJsonSupersetOf('languages', parsed)
        }
      }) */

      
      .andWhere(function () {
        if (name) {
          if(name.includes(" ")){
            let names = name.split(" ")
            for (let i = 0; i < names.length; i++) {
              if(i==0){
                this.andWhere(raw('lower(unaccent(users."firstname"))'), 'like', `%${names[i]}%`);
              }else{
                this.andWhere(raw('lower(unaccent(users."lastname"))'), 'like', `%${names[i]}%`);
              }
            }
          }else{
            this.orWhere(raw('lower(unaccent(users."firstname"))'), 'like', `%${name}%`);
            this.orWhere(raw('lower(unaccent(users."lastname"))'), 'like', `%${name}%`);
          }
        }
      })         


  }

  getUser(userId) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'document',
        'phone',
        'email',
        'role',
        'disabled',
        'rate_minute',
        'rate_hour',
        'half_day',
        'full_day',
        'rate_page',
        's_rate_min',
        'v_rate_min',
        'sworn',
        'notsworn',
        'simultaneous',
        'consecutive',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'address_1',
        'address_2',
        'nationality',
        'description',
        'languages',
        'specialities',
        'work_experience',
        'unavailable',
        'image_url',
        'company_name',
        'disabled',
        'unavailable',
        'address_additional',
        'approved_translator',
        'remote_tools',
        'translator_services',
        'admin_permissions',
        'stripe_id'
      )
      .where("deleted", false)
      .orderBy('created_at', 'desc')
      .where("id", userId )
  }

  getUserSimple(userId) {
    return this.model
      .query()
      .select(
        'id',
        'firstname',
        'lastname',
        'role',
        'disabled',
        'rate_minute',
        'rate_hour',
        'half_day',
        'full_day',
        'rate_page',
        's_rate_min',
        'v_rate_min',
        'sworn',
        'notsworn',
        'simultaneous',
        'consecutive',
        'country_id',
        'city_id',
        'country',
        'city',
        'department_id',
        'nationality',
        'description',
        'languages',
        'specialities',
        'work_experience',
        'labor_months',
        'unavailable',
        'image_url',
        'disabled',
        'unavailable',
        'remote_tools',
        'translator_services',
        'certifications',
        'phone',
        'email'
      )
      .where("id", userId )
  }
}

module.exports = new Repository(fields);
