const usersRepository = require('./repository');
const languagesRepository = require('../languages/repository');
const specialitiesRepository = require('../specialities/repository');
const reviewsRepository = require('../reviews/repository');
const platformsRepository = require('../platforms/repository');
const serRepository = require('../services/repository')
const servicesRepository = require('../translation_services/repository');
const unavailabilitiesRepository = require('../unavailabilities/repository');
const transactionsRepository = require('../transactions/repository');
const transactionsController = require('../transactions/controller');

const { formatError } = require('../../utils/helpers');
const { decodeToken } = require('../../utils/helpers');
const { imageUpload } = require('../../utils/file')

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const {
    createCustomer
} = require('../../utils/payments');

async function index(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            name = '',
            email='',
            disabled='',
            city_id='',
            department_id='',
            country_id=''
        }
    } = req;

    try {
        const users = await usersRepository.getUsers(page, page_limit, name, email, disabled, city_id, department_id, country_id);
        const languages = await languagesRepository.getAllLanguages();
        const specialities = await specialitiesRepository.getAllSpecialities();


        users.results.forEach(element => {
            //console.log(element.languages)
            if(element.languages){
                element.languages.forEach(language => {
                    let newFrom = (languages.filter(lang => lang.id == language.from))
                    let newTo = (languages.filter(lang => lang.id == language.to))

                    if(newFrom[0]){
                        language.from=newFrom[0]
                    }

                    if(newTo[0]){
                        language.to=newTo[0]
                    }
                });
            }

            //console.log(specialities)
            if(element.specialities){
                let cached = element.specialities;
                element.specialities=[]
                cached.forEach(speciality => {
                    let newSpeciality = (specialities.filter(spec => spec.id == speciality))
                    if(newSpeciality[0]){
                        element.specialities.push(newSpeciality)
                    }
                });

            }
            
            
        });
        
        return res.status(200).send({
            users,
            page: parseInt(page),
            pages: Math.ceil(users.total / page_limit),
            total: users.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function getClients(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            name = '',
            sort_by = 'created_at',
            sort_order = 'desc',
            disabled = 'false'
        }
    } = req;

    try {
        const users = await usersRepository.getClients(page, page_limit, name, disabled, sort_by, sort_order);
        
        return res.status(200).send({
            users,
            page: parseInt(page),
            pages: Math.ceil(users.total / page_limit),
            total: users.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function getAdmins(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            name = '',
            sort_by = 'created_at',
            sort_order = 'desc',
            disabled = 'false'
        }
    } = req;

    try {
        const users = await usersRepository.getAdmins(page, page_limit, name, disabled, sort_by, sort_order);
        
        return res.status(200).send({
            users,
            page: parseInt(page),
            pages: Math.ceil(users.total / page_limit),
            total: users.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function getTranslators(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            name = '',
            speciality_id = '',
            translator_service_id = '',
            languages = '',
            grade = '',
            min_price_minute = '',
            max_price_minute = '',
            min_price_hour = '',
            max_price_hour = '',
            min_price_page= '',
            max_price_page= '',
            min_halfday = '',
            max_halfday = '',
            min_fullday = '',
            max_fullday='',
            min_s_rate_min= '',
            max_s_rate_min= '',
            min_v_rate_min= '',
            max_v_rate_min= '',
            min_experience = '',
            max_experience = '',
            min_available_time = '',
            max_available_time = '',
            approved_translator = '1',
            sort_by = 'created_at',
            sort_order = 'desc',
            disabled = 'false',
            sworn = '',
            notsworn= '',
            simultaneous = '',
            consecutive = '',
        }
    } = req;

    try {
        let users = await usersRepository.getTranslators(name, speciality_id,translator_service_id, languages, approved_translator, sort_by, sort_order, disabled);
        const repoLanguages = await languagesRepository.getAllLanguages();
        const specialities = await specialitiesRepository.getAllSpecialities()
        const platforms = await platformsRepository.getAllPlatforms()
        const translator_services = await serRepository.getAllSer()
        
        for (let i = 0; i < users.length; i++) {

            const element = users[i];

            if(element.languages){
                element.languages.forEach(language => {
                    let newFrom = (repoLanguages.filter(lang => lang.id == language.from))
                    let newTo = (repoLanguages.filter(lang => lang.id == language.to))

                    if(newFrom[0]){
                        language.from=newFrom[0]
                    }

                    if(newTo[0]){
                        language.to=newTo[0]
                    }
                });
            }

            //console.log(specialities)
            if(element.specialities){
                let cached = element.specialities;
                element.specialities=[]
                cached.forEach(speciality => {
                    let newSpeciality = (specialities.filter(spec => spec.id == speciality))
                    if(newSpeciality[0]){
                        element.specialities.push(...newSpeciality)
                    }
                });

            }
            
            if(element.translator_services){
                let cached = JSON.parse(element.translator_services);
                element.translator_services=[]
                cached.forEach(service => {
                    let newService = (translator_services.filter(ser => ser.id == service))
                    if(newService[0]){
                    element.translator_services.push(...newService)
                    }
                });
            }

            let reviews = await  reviewsRepository.getUserReviews(element.id, "1")

            element.rating = null

            if(reviews.length){
                let avg = 0
                let total = 0
                reviews.forEach(element => {
                    if(element.grade){
                        total = parseInt(element.grade) + total
                    }
                });
                avg = total/reviews.length
                element.rating = avg.toFixed(2)
                element.total_ratings=reviews.length
            }

            if(element.labor_months){
                element.total_experience_years = Math.floor(element.labor_months/12)                
            }

            if(element.remote_tools){
                let cached = element.remote_tools;
                element.remote_tools=[]
                cached.forEach(platform => {
                    let newPlatform = (platforms.filter(plat => plat.id == platform))
                    if(newPlatform[0]){
                        element.remote_tools.push(...newPlatform)
                    }
                });

            }
           
            

            if(element.unavailable==false || ( min_available_time!='' && max_available_time!='' ) ){

                let unavailabilities = await  unavailabilitiesRepository.getAllUserUnavailabilities(element.id)
                let current_date =  moment().format()
                let found = 0;
                let foundFilter = 0

                unavailabilities.forEach(unav => {
                    if(
                        moment(current_date).isAfter(unav.from) &&
                        moment(current_date).isBefore(unav.to)
                    ){
                        found++
                    }

                    if(min_available_time!='' && max_available_time){
                        if(
                            (moment(unav.from).isAfter(min_available_time) &&
                            moment(unav.to).isBefore(max_available_time))
                            ||
                            (moment(unav.from).isBefore(min_available_time) &&
                            moment(unav.to).isAfter(min_available_time))
                            ||
                            (moment(unav.from).isBefore(max_available_time) &&
                            moment(unav.to).isAfter(max_available_time))
                        ){
                            foundFilter++
                        }
                    }


                });

                if(found>0){
                    element.unavailable=true
                }

                if(min_available_time!='' && max_available_time!=''){
                    if(foundFilter>0){
                        element.toRemoveFromAvailables = true;
                    }                
                }
            }
            
        }

        if(grade){
            users = users.filter(item => item.rating >= grade);
        }
        if(simultaneous){
            users = users.filter(item => item.simultaneous == "true")
        }
        if(consecutive){
            users = users.filter(item => item.consecutive == "true")
        }
        if(sworn){
            users = users.filter(item => item.sworn == "true")
        }
        if(notsworn){
            users = users.filter(item => item.notsworn == "true")
        }

        if(min_price_minute!='' && max_price_minute!=''){
            users = users.filter(item => parseFloat(item.rate_minute) >= parseFloat(min_price_minute) && parseFloat(item.rate_minute) <= parseFloat(max_price_minute))
        }

        if(min_price_hour!='' && max_price_hour!=''){
            users = users.filter(item => parseFloat(item.rate_hour) >= parseFloat(min_price_hour) && parseFloat(item.rate_hour) <= parseFloat(max_price_hour))
        }

        if(min_halfday!='' && max_halfday!=''){
            users = users.filter(item => parseFloat(item.half_day) >= parseFloat(min_halfday) && parseFloat(item.half_day) <= parseFloat(max_halfday))
        }
        if(min_fullday!='' && max_fullday!=''){
            users = users.filter(item => parseFloat(item.full_day) >= parseFloat(min_fullday) && parseFloat(item.full_day) <= parseFloat(max_fullday))
        }
        
        if(min_price_page!='' && max_price_page!=''){
            users = users.filter(item => parseFloat(item.rate_page) >= parseFloat(min_price_page) && parseFloat(item.rate_page) <= parseFloat(max_price_page))
        }

        if(min_s_rate_min!='' && max_s_rate_min!=''){
            users = users.filter(item => parseFloat(item.s_rate_min) >= parseFloat(min_s_rate_min) && parseFloat(item.s_rate_min) <= parseFloat(max_s_rate_min))
        }
        if(min_v_rate_min!='' && max_v_rate_min!=''){
            users = users.filter(item => parseFloat(item.v_rate_min) >= parseFloat(min_v_rate_min) && parseFloat(item.v_rate_min) <= parseFloat(max_v_rate_min))
        }

        if(min_experience!='' && max_experience!=''){
            if(parseInt(max_experience)<120){
                users  = users.filter(item => parseInt(item.labor_months) <= parseInt(max_experience) )
            }
            if(parseInt(min_experience)>0){
                users  = users.filter(item => parseInt(item.labor_months) >= parseInt(min_experience) )
            }
            console.log(parseInt(min_experience))
        }

        
        if(min_available_time!='' && max_available_time){
            users = users.filter(item => item.toRemoveFromAvailables != true);
        }

        if(languages){
            let to = JSON.parse(languages)[0].to
            let from = JSON.parse(languages)[0].from
            let found = []
            users.forEach(user => {
                user.languages.forEach(element=>{
                    console.log(element.to.id)
                    if(element.to.id == to && element.from.id == from){
                        found.push(user)
                        console.log("found")
                    }
                })
            });
            users=found
        }

        let total = users.length
      
        users = users.slice((page - 1) * page_limit, page * page_limit)
     
        return res.status(200).send({
            users,
            page: parseInt(page),
            pages: Math.ceil(total / page_limit),
            total: total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function getUser(req, res) {

    try {

        const {
            headers: { authorization },
            params: { id }
        } = req;
        
        let userId
        
        if(authorization){
            userId = await decodeToken(authorization.replace("Bearer ", ""));
        }
        
        let user;

        if(userId==id){
            user = await usersRepository.findById(id);
        }else{
            let rep = await usersRepository.getUserSimple(id)
            user = rep[0]
        }

        const repoLanguages = await languagesRepository.getAllLanguages();
        const specialities = await specialitiesRepository.getAllSpecialities()
        const platforms = await platformsRepository.getAllPlatforms()
        const translator_services = await serRepository.getAllSer()
        // console.log(translator_services)
        // console.log(specialities)
        if(user){
            delete user.password
            
            if(user.languages){
                user.languages.forEach(language => {
                    let newFrom = (repoLanguages.filter(lang => lang.id == language.from))
                    let newTo = (repoLanguages.filter(lang => lang.id == language.to))

                    if(newFrom[0]){
                        language.from=newFrom[0]
                    }

                    if(newTo[0]){
                        language.to=newTo[0]
                    }
                });
            }

            //console.log(specialities)
            if(user.specialities){
                let cached = user.specialities;
                user.specialities=[]
                cached.forEach(speciality => {
                    let newSpeciality = (specialities.filter(spec => spec.id == speciality))
                    if(newSpeciality[0]){
                        user.specialities.push(...newSpeciality)
                    }
                });

            } 
            

            if(user.labor_months){
                user.total_experience_years = Math.floor(user.labor_months/12)                
            }
            
            if(user.remote_tools){
                let cached = user.remote_tools;
                 console.log(cached,"remote_tools")
                user.remote_tools=[]
                cached.forEach(platform => {
                    let newPlatform = (platforms.filter(plat => plat.id == platform))
                    if(newPlatform[0]){
                        user.remote_tools.push(...newPlatform)
                    }
                });

            }
            if(user.translator_services){
                let cached = JSON.parse(user.translator_services);
              
                console.log(cached,"translator_services")
                
                user.translator_services=[]
                
                cached.forEach(service => {
                    let newService = (translator_services.filter(ser => ser.id == service))
                    console.log(newService)
                    if(newService[0]){
                        user.translator_services.push(...newService)
                    }
                });
            }
            
            console.log(user,"user")

            if(user.role == "2"){
                const transactions = await transactionsRepository.getAllTransactionsTranslator(user.id)

                user.total_services = transactions.length ? transactions.length : 0

                let reviews = await  reviewsRepository.getUserReviews(user.id, "1")

                user.rating = null

                user.total_ratings = 0

                if(reviews.length){
                    let avg = 0
                    let total = 0
                    reviews.forEach(element => {
                        if(element.grade){
                            total = parseInt(element.grade) + total
                        }
                    });
                    avg = total/reviews.length
                    user.rating = avg.toFixed(2)
                    user.total_ratings=reviews.length

                }

                if(user.unavailable==false){

                    let unavailabilities = await  unavailabilitiesRepository.getAllUserUnavailabilities(user.id)
                    let current_date =  moment().format()
                    let found = 0;
    
                    unavailabilities.forEach(unav => {
                        if(
                            moment(current_date).isAfter(unav.from) &&
                            moment(current_date).isBefore(unav.to)
                        ){
                            found++
                        }       
                    });
    
                    if(found>0){
                        user.unavailable=true
                    }
                }

                user.total_transactions = await transactionsController.getTotalTransactions(req, res, user.id)
                
            }
            if(user.role == "3" || user.role == "4"){
                const services = await servicesRepository.getServicesByClient(1, 10, user.id)
                user.total_services = services.total
                user.total_transactions = await transactionsController.getTotalTransactions(req, res, user.id)

            }




            return res.status(200).send({
                user
            });
        }else{
            return res.status(500).send({ message: "Usuario no encontrado" });
        }


    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function store(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const { body } = req;
            const { password } = body;

            console.log(req.body)
            //console.log(body)

            if(body.role=="3" || body.role=="4"){
                const customerPayment = await createCustomer(body)
                console.log(customerPayment)
                body.stripe_id = customerPayment.id
            }

            body.email = body.email.toLowerCase()

            await usersRepository.create({
                ...body,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),

            });

            return res
                .status(201)
                .send({ message: 'Usuario creado exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function update(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const {
                headers: { authorization },
                body
            } = req;

            const tokenUser = await decodeToken(authorization.replace("Bearer ", ""));

            if (body.password) {
                body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))
            }else{
                delete body.password
            }

            const user = await usersRepository.findOne({ id: tokenUser });

            if(body.email){
                if(body.email==user.email){
                    delete body.email
                }else{
                    const emailOwner = await usersRepository.findOne({ email: body.email });
                    if(emailOwner){
                        return res
                            .status(401)
                            .send({ message: 'Correo pertenece a otro usuario', code: "MAIL_IN_USE" });
                    }
                }
            }


            await usersRepository.update(
                { ...body },
                { id: tokenUser }
            )

            return res
                .status(201)
                .send({ message: 'Usuario actualizado exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function updatePassword(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const {
                headers: { authorization },
                body: { oldPassword, newPassword }
            } = req;

            const userId = await decodeToken(authorization.replace("Bearer ", ""));

            const user = await usersRepository.findOne({ id: userId });

            const isEqual = await bcrypt.compare(oldPassword, user.password);

            if(isEqual){

                let newPasswordCrypt = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))

                await usersRepository.update(
                    { password: newPasswordCrypt },
                    { id: userId }
                )

                return res
                    .status(201)
                    .send({ message: 'Usuario actualizado exitosamente' });
            }else{
                return res.status(400).send({ message: "Contraseña errónea" });
            }
            
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}



async function adminUpdate(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const {
                params: { id },
                body
            } = req;

            if (body.password) {
                body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(10))
            }

            await usersRepository.update(
                { ...body },
                { id: id }
            )

            return res
                .status(201)
                .send({ message: 'Usuario actualizado exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}



async function approval(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const {
                params: { id },
                body: {approved_translator}
            } = req;

            await usersRepository.update(
                { approved_translator: approved_translator },
                { id: id }
            )

            getUser(req, res, id )

        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}



async function remove(req, res) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res
                .status(409)
                .send({ errors: errors.formatWith(formatError).mapped() });
        else {
            const {
                params: { id }
            } = req;
            
            await usersRepository.deleteById(id)

            return res
                .status(201)
                .send({ message: 'Usuario removido exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function disable(req, res) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).send({
                message: 'Olvidó autenticarse'
            });
        }

        const token = authorization.replace("Bearer ", "")
        const userId = await decodeToken(token);
        
        await usersRepository.update(
            { disabled: true },
            { id: userId }
        )

        return res
            .status(201)
            .send({ message: 'Usuario deshabilitado exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function setUnavailability(req, res) {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({
            message: 'Olvidó autenticarse'
        });
    }

    const token = authorization.replace("Bearer ", "")
    const userId = await decodeToken(token);
    const user = await usersRepository.findById(userId);
    if (!user) return res.status(403).send({ message: 'Olvidó autenticarse' });

    try {

        if(user.role!="2"){
            return res.status(500).send({ message: "No es posible setear disponibilidad en este rol." });
        }

        await usersRepository.update(
            { unavailable: true },
            { id: userId }
        )

        return res
            .status(201)
            .send({ message: 'Usuario actualizado exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function setAvailability(req, res) {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({
            message: 'Olvidó autenticarse'
        });
    }

    const token = authorization.replace("Bearer ", "")
    const userId = await decodeToken(token);
    const user = await usersRepository.findById(userId);
    if (!user) return res.status(403).send({ message: 'Olvidó autenticarse' });

    try {

        if(user.role!="2"){
            return res.status(500).send({ message: "No es posible setear disponibilidad en este rol." });
        }

        await usersRepository.update(
            { unavailable: false },
            { id: userId }
        )

        return res
            .status(201)
            .send({ message: 'Usuario actualizado exitosamente' });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function uploadImage(req, res) {
    try {
        let image = await imageUpload(req, "users")
        res.status(200).send({ image: JSON.parse(image[0]) })
    } catch (e) {
        console.log("error", e)
        res.status(400).send({ error: e })
    }
}


module.exports = {
    index,
    getUser,
    getTranslators,
    store,
    update,
    remove,
    setUnavailability,
    setAvailability,
    uploadImage,
    approval,
    adminUpdate,
    getAdmins,
    getClients,
    updatePassword,
    disable
};
