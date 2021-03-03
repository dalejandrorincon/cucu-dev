import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import * as Yup from 'yup';

import { useFormik } from 'formik';

import { Form } from "react-bootstrap";

import * as ServicesAPI from '../../api/services';

//import "./styles.scss"
import { useTranslation } from 'react-i18next';

export default function RateModal(props) {

	const [confirmDisable, setConfirmDisable] = useState(false)

	const { t, i18n } = useTranslation();
	
	const validationSchema = Yup.object().shape({
        url: Yup.string()
            .min(3, t('required-rate'))
            .required(t('required-field'))
	});

	const formik = useFormik({
		initialValues: {
            url: props.service?.url,
		},
		onSubmit: values => {
            console.log(values)
			setConfirmDisable(true)
			editService(values)
		},
		validationSchema: validationSchema,
		validateOnBlur: true,
		enableReinitialize: true
	});

	const editService = (values) =>{
        ServicesAPI.updateService(localStorage.getItem("token"), values, props.service?.id).then((res) => {
            setConfirmDisable(false)
            props.onHide()
            props.editSuccess(formik.values.url)
            formik.resetForm()
        })
    }
    
    useEffect(() => {
        formik.resetForm()
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
					{t('request-modal.edit-url')}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container className="form-container">

                    
					<Form.Group>
						<Form.Control
							id="url"
							placeholder={t('request-modal.update-url')}
							value={formik.values.url}
							onChange={(e) => {
								formik.setFieldTouched('url');
								formik.handleChange(e)
							}}
						/>
					</Form.Group>
					{formik.touched.url && formik.errors.url ? (
						<div className="alert alert-danger">{formik.errors.url}</div>
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
						{t('request-modal.save-url')}
					</Button>
				</Container>
			</Modal.Footer>
		</Modal>
	);
}