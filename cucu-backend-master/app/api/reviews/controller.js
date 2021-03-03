const reviewRepository = require('./repository');
const { validationResult } = require('express-validator');
const helper = require('../../utils/helpers');
const usersRepository = require('../users/repository');


async function index(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            approved = "1"
        }
    } = req;

    try {
        const reviews = await reviewRepository.getReviews(page, page_limit, approved);
        return res.status(200).send({
            ...reviews,
            page: parseInt(page),
            pages: Math.ceil(reviews.total / page_limit),
            total: reviews.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function userReviews(req, res) {

    let {
        params: { id },
        query: {
            page_limit = 10,
            approved = "1"
        }
    } = req;

    try {
        let reviews = await reviewRepository.getUserReviews(id, approved);
        let avg = 0
        let total = 0
        if(reviews.length){
            reviews.forEach(element => {
                if(element.grade){
                    total = parseInt(element.grade) + total
                }
            });
            avg = total/reviews.length
        }else{
            avg = 0
        }

        if(page_limit){
            reviews = reviews.slice(0, page_limit)
        }

        return res.status(200).send({
            reviews,
            total: reviews.length,
            average: avg.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function reviewsByTranslator(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            grade = '',
            date = '',
            translator_id = '',
            client_id = '',
            service_id = '',
            approved = "1"
        }
    } = req;

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({
            message: 'Olvidó autenticarse'
        });
    }

    const token = authorization.replace("Bearer ", "")
    translator_id = await helper.decodeToken(token);
    const user = await usersRepository.findById(translator_id);
    if (!user) return res.status(403).send({ message: 'Olvidó autenticarse' });

    try {
        const reviews = await reviewRepository.getReviewsTranslator(page, page_limit, grade, date, translator_id, client_id, service_id, approved);
        return res.status(200).send({
            ...reviews,
            page: parseInt(page),
            pages: Math.ceil(reviews.total / page_limit),
            total: reviews.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}


async function reviewsByClient(req, res) {

    let {
        query: {
            page = 1,
            page_limit = 10,
            grade = '',
            date = '',
            translator_id = '',
            client_id = '',
            service_id = '',
            approved = "1"
        }
    } = req;

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).send({
            message: 'Olvidó autenticarse'
        });
    }

    const token = authorization.replace("Bearer ", "")
    client_id = await helper.decodeToken(token);
    const user = await usersRepository.findById(client_id);
    if (!user) return res.status(403).send({ message: 'Olvidó autenticarse' });

    try {
        const reviews = await reviewRepository.getReviewsClient(page, page_limit, grade, date, translator_id, client_id, service_id, approved);
        return res.status(200).send({
            ...reviews,
            page: parseInt(page),
            pages: Math.ceil(reviews.total / page_limit),
            total: reviews.total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}

async function getAll(req, res) {
    try {
        const reviews = await reviewRepository.getAllReviews();
        return res.status(200).send(reviews);
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
            console.log(req.body)
            //console.log(body)

            await reviewRepository.create({
                ...body
            });

            return res
                .status(201)
                .send({ message: 'Review creado exitosamente' });
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
                params: { id },
                body
            } = req;
            
            await reviewRepository.update(
                { ...body },
                { id: id }
            )

            return res
                .status(201)
                .send({ message: 'Review actualizado exitosamente' });
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
            
            await reviewRepository.deleteById(id)

            return res
                .status(201)
                .send({ message: 'Review removido exitosamente' });
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
                body: {approved}
            } = req;

            await reviewRepository.update(
                { approved: approved },
                { id: id }
            )

            return res
                .status(201)
                .send(await reviewRepository.findById(id));

        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
}



module.exports = {
    index,
    store,
    update,
    remove,
    getAll,
    reviewsByTranslator,
    reviewsByClient,
    userReviews,
    approval
};
