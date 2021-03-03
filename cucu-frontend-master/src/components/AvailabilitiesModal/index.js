import React, { useState } from 'react'
import * as Yup from 'yup';
import { Modal, Button, Container, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

import { combineDateWithTime } from "../../utils/constants"
import { useFormik } from 'formik';
import * as UnavailabilitiesAPI from '../../api/unavailabilities';
import { useTranslation } from 'react-i18next';
import { Form } from "react-bootstrap";

export default function AvailabilitiesModal(props) {

    const [confirmDisable, setConfirmDisable] = useState(false)
	const { t, i18n } = useTranslation();

    const validationSchema = Yup.object().shape({
        date_start: Yup.string()
            .min(1, t('required-select'))
            .required(t('required-field')),
        date_end: Yup.string()
            .min(1, t('required-select'))
            .required(t('required-field')),
        time_start: Yup.string()
            .min(1, t('required-select'))
            .required(t('required-field')),
        time_end: Yup.string()
            .min(1, t('required-select'))
            .required(t('required-field')),
    });


    const formik = useFormik({
        initialValues: {
            date_start: props.unavailability?.from,
            date_end: props.unavailability?.to,
            time_start: props.unavailability?.from,
            time_end: props.unavailability?.to
        },
        onSubmit: values => {
            setConfirmDisable(true)
            let userId = localStorage.getItem("userId")
            let startDateTime;
            let endDateTime;            

            switch (props.type) {
                case "create":
                    startDateTime = combineDateWithTime(formik.values.date_start, formik.values.time_start)
                    endDateTime = combineDateWithTime(formik.values.date_end, formik.values.time_end)
                    createUnavailability({ from: startDateTime, to: endDateTime, translator_id: userId })
                    break;
                case "edit":
                    startDateTime = combineDateWithTime(moment(formik.values.date_start).toDate(), moment(formik.values.time_start).toDate())
                    endDateTime = combineDateWithTime(moment(formik.values.date_end).toDate(), moment(formik.values.time_end).toDate())
                    editUnavailability({ from: startDateTime, to: endDateTime, translator_id: userId })
            }
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        enableReinitialize: true
    });

    const createUnavailability = (values) => {
        UnavailabilitiesAPI.createUnavailability(values, localStorage.getItem("token")).then((res) => {
            setConfirmDisable(false)
            props.onHide()
            props.success(t('availabilities-list.created'))
            formik.resetForm()
        })
    }

    const editUnavailability = (values) => {
        UnavailabilitiesAPI.updateUnavailability(values, localStorage.getItem("token"), props.unavailability?.id).then((res) => {
            setConfirmDisable(false)
            props.onHide()
            props.success(t('availabilities-list.edited'))
            formik.resetForm()
        })
    }



    return (
        <div>
            <Modal
                {...props}
                className="availabilities-modal right"
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.type == "create" ? <>{t('availabilities-list.create-unavailability')}</> : <>{t('availabilities-list.edit-unavailability')}</>}

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="form-container">
                        <div className="date-item">
                            <p>{t('availabilities-list.create-unavailabilty-label')}</p>
                            <Form.Group>
                                <Row className="margin-row-form">
                                    <Col className="col-md-5">
                                        <DatePicker
                                            className="form-control"
                                            placeholderText={t('availabilities-list.date')}
                                            selected={(formik.values.date_start && new Date(formik.values.date_start)) || null}
                                            onChange={(e) => {
                                                formik.setFieldTouched('date_start');
                                                formik.setFieldValue('date_start', e)
                                            }}
                                            minDate={ new Date()}
                                            maxDate={formik.values.date_end}
                                            dateFormat="dd/MM/yyyy"

                                        />
                                    </Col>
                                    <Col className="col-md-2">
                                        <span>{t('availabilities-list.to')}</span>
                                    </Col>

                                    <Col className="col-md-5">
                                        <DatePicker
                                            className="form-control"
                                            placeholderText={t('availabilities-list.date')}
                                            selected={(formik.values.date_end && new Date(formik.values.date_end)) || null}
                                            onChange={(e) => {
                                                formik.setFieldTouched('date_end');
                                                formik.setFieldValue('date_end', e)
                                            }}
                                            minDate={formik.values.date_start ? formik.values.date_start : new Date() }
                                            dateFormat="dd/MM/yyyy"

                                        />
                                    </Col>                                   

                                </Row>
                                <Row className="margin-row-form">

                                    <Col className="col-md-5">
                                        <DatePicker
                                            className="form-control"
                                            placeholderText={t('availabilities-list.time')}
                                            selected={(formik.values.time_start && new Date(formik.values.time_start)) || null}
                                            onChange={(e) => {
                                                formik.setFieldTouched('time_start');
                                                formik.setFieldValue('time_start', e)
                                            }}
                                            minTime={ moment().isSame(moment((formik?.values?.date_start)?.toString()), 'date') ? moment().toDate() : moment().startOf("day").toDate()}
                                            maxTime={ moment(formik?.values?.date_end?.toString()).isSame(moment(formik?.values?.date_start?.toString()), 'date') ? moment(formik.values.time_end).subtract(30, 'minutes').toDate() : moment().endOf("day").toDate()}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"

                                        />
                                    </Col>
                                    
                                    <Col className="col-md-2">
                                        <span>{t('availabilities-list.to')}</span>
                                    </Col>

                                    <Col className="col-md-5">
                                        <DatePicker
                                            className="form-control"
                                            placeholderText={t('availabilities-list.time')}
                                            selected={(formik.values.time_end && new Date(formik.values.time_end)) || null}
                                            onChange={(e) => {
                                                formik.setFieldTouched('time_end');
                                                formik.setFieldValue('time_end', e)
                                            }}
                                            minTime={ moment(formik?.values?.date_end?.toString()).isSame(moment(formik?.values?.date_start?.toString()), 'date') ? moment(formik.values.time_start).add(30, 'minutes').toDate() : moment().startOf("day").toDate()}
                                            maxTime={ moment().endOf("day").toDate()}
                                            showTimeSelect
                                            showTimeSelectOnly
                                            timeIntervals={30}
                                            timeCaption="Time"
                                            dateFormat="h:mm aa"

                                        />
                                    </Col>
                                </Row>
                            </Form.Group>
                        </div>
                        {(formik.touched.date && formik.errors.date) ||
                            (formik.touched.time_start && formik.errors.time_start) ||
                            (formik.touched.time_end && formik.errors.time_end)
                            ? (
                                <>
                                    <div className="alert alert-danger">{t('availabilities-list.field-required')}</div>
                                </>
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
                            {props.type == "create" ? <>{t('create')}</> : <>{t('edit')}</>}
                        </Button>
                    </Container>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
