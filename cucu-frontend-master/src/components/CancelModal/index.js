import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import * as Yup from 'yup';

import { useFormik } from 'formik';
import * as ServicesAPI from '../../api/services';

import { Form } from "react-bootstrap";

import "./styles.scss"
import { useTranslation } from 'react-i18next';

export default function CancelModal(props) {

	const [confirmDisable, setConfirmDisable] = useState(false)
	const { t, i18n } = useTranslation();

	const validationSchema = Yup.object().shape({
		cancel_reason: Yup.string()
			.min(3, t('min-char', {num: 3}))
			.required(t('required-field'))
	});

	const formik = useFormik({
		initialValues: {
			cancel_reason: ""
		},
		onSubmit: values => {
			setConfirmDisable(true)
			switch (props.type) {
				case "cancel":
					cancelService(values)
					break;
				case "reject":
					rejectService(values)
			}
		},
		validationSchema: validationSchema,
		validateOnBlur: true,
		enableReinitialize: true
	});



	const cancelService = (values) => {
		ServicesAPI.cancelService(localStorage.getItem("token"), props.service?.id, values, localStorage.getItem("role")).then((res) => {
			setConfirmDisable(false)
			props.onHide()
			props.cancelSuccess(t('cancel.cancelled'))
			formik.resetForm()
		})
	}

	const rejectService = (values) => {
		ServicesAPI.rejectService(localStorage.getItem("token"), props.service?.id, values).then((res) => {
			setConfirmDisable(false)
			props.onHide()
			props.cancelSuccess(t('cancel.rejected'))
			formik.resetForm()
		})
	}



	return (
		<Modal
			{...props}
			className="cancel-modal"
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					{props.type == "cancel" ? <>{t('cancel.cancel-service')}</> : <>{t('cancel.reject-service')}</>}

				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container className="form-container">
					{props.type == "cancel" ?
						<>{t('cancel.cancel-label')}</>
						: <>{t('cancel.reject-label')}</>
					}
					<Form.Group>
						<Form.Control
							id="cancel_reason"
							type="textarea"
							as="textarea"
							rows="5"
							placeholder={t('cancel.reasons')}
							value={formik.values.cancel_reason}
							onChange={(e) => {
								formik.setFieldTouched('cancel_reason');
								formik.handleChange(e)
							}}
						/>
					</Form.Group>
					{formik.touched.cancel_reason && formik.errors.cancel_reason ? (
						<div className="alert alert-danger">{formik.errors.cancel_reason}</div>
					) : null}
				</Container>

			</Modal.Body>
			<Modal.Footer>
				<Container className="form-container">
					<Button
						variant="danger"
						disabled={confirmDisable}
						onClick={
							() => formik.submitForm()
						}>
						{props.type == "cancel" ? <>{t('cancel.cancel-service')}</> : <>{t('cancel.reject-service')}</>}
					</Button>
				</Container>
			</Modal.Footer>
		</Modal>
	);
}