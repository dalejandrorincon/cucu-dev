import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import * as Yup from 'yup';

import { useFormik } from 'formik';
import * as RatingsAPI from '../../api/ratings';
import * as ServicesAPI from '../../api/services';

import { Form } from "react-bootstrap";

import Rating from "react-rating";
import * as UsersAPI from '../../api/users';

import "./styles.scss"
import { useTranslation } from 'react-i18next';

export default function RateModal(props) {

	const [confirmDisable, setConfirmDisable] = useState(false)
	const [translator, setTranslator] = useState(null)

	const { t, i18n } = useTranslation();
	
	const validationSchema = Yup.object().shape({
		comment: Yup.string()
			.min(3, t('min-char', {num: 3})),
            //.required("*Este campo es obligatorio")
        rating: Yup.number()
            .min(1, t('required-rate'))
            .required(t('required-field'))
	});

	const formik = useFormik({
		initialValues: {
            comment: "",
            rating: 0
		},
		onSubmit: values => {
            //console.log(values)
			setConfirmDisable(true)
			rateService(values)
		},
		validationSchema: validationSchema,
		validateOnBlur: true,
		enableReinitialize: true
	});

	const rateService = (values) => {

        let payload = {
            grade: values.rating,
            translator_id: props.service.translator_id,
            client_id: props.service.client_id,
			service_id: props.service.id,
			description: values.comment,
            approved: "1"
        }

		RatingsAPI.createRating(localStorage.getItem("token"), payload).then((res) => {
            ServicesAPI.rateService(localStorage.getItem("token"), props.service?.id).then((res) => {
                setConfirmDisable(false)
                props.onHide()
                props.rateSuccess()
                formik.resetForm()
            })
		})
	}

	const getProfile = () => {
        UsersAPI.getUser({}, props.service?.translator?.id, localStorage.getItem("token")).then((res) => {
            //console.log(res.user)
            setTranslator(res.user)
        })
	};
	
	useEffect(() => {
		if(props.service?.translator?.id){
			getProfile();
		}
	}, [props.service]);

	return (
		<Modal
			{...props}
			className="rate-modal"
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{t('rate.rate-service')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container className="form-container">

                    <img
                        src={props.service?.translator?.image_url ? props.service?.translator.image_url : "/assets/images/no_avatar_default.png"}
                        className="image-profile ico-user"
                    />
                    <p className="user-name"><b>{props.service?.translator?.firstname} {props.service?.translator?.lastname}</b></p>	

					<p>{translator?.total_services} servicios</p>		
        
                    <Rating
                        emptySymbol="fa fa-star-o fa-2x fa-start"
                        fullSymbol="fa fa-star fa-2x fa-start"
                        className="startcontainer"
                        onChange={(rate) =>{
                            formik.setFieldValue("rating", rate)
                        }}
                        initialRating={formik.values.rating}
                    />

                    {formik.touched.rating && formik.errors.rating ? (
						<div className="alert alert-danger">{formik.errors.rating}</div>
					) : null}

					<Form.Group>
						<Form.Control
							id="comment"
							type="textarea"
							as="textarea"
							rows="5"
							placeholder={t('rate.rate-label')}
							value={formik.values.comment}
							onChange={(e) => {
								formik.setFieldTouched('comment');
								formik.handleChange(e)
							}}
						/>
					</Form.Group>
					{formik.touched.comment && formik.errors.comment ? (
						<div className="alert alert-danger">{formik.errors.comment}</div>
					) : null}
				</Container>

			</Modal.Body>
			<Modal.Footer>
				<Container className="form-container">
					<Button
						className="cucu-button"
						disabled={confirmDisable}
						onClick={
							() => formik.submitForm()
						}>
						{t('rate.rate-this')}
					</Button>
				</Container>
			</Modal.Footer>
		</Modal>
	);
}