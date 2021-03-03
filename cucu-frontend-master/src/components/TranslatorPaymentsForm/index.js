import React, { useState, useEffect } from 'react'
import { Form, Alert } from "react-bootstrap";

import {
    Label,
    Submit,
    Control,
    Title
} from "./styles"
import "./styles.scss"

import { useFormik } from 'formik';
import * as Yup from 'yup';

import * as BanksAPI from '../../api/banks';
import * as PaymentDataAPI from '../../api/payment_data';
import * as CountriesAPI from '../../api/countries';

import { useTranslation } from 'react-i18next';

export default function TranslatorProfileForm() {
    const { t, i18n } = useTranslation();

    const [entity, setEntity] = useState({
        bank_id: "",
        account_type: "",
        account_number: "",
        owner_name: "",
        document_type: "",
        document_number: "",
        payoneer_account: "",
    });

    const [buttonState, setButtonState] = useState({ label: t('experience.save-changes'), disabled: false })
    const [banks, setBanks] = useState(null)
    const [response, setResponse] = useState(null)
    const [countries, setCountries] = useState(null)

    useEffect(() => {
        getBanks();
        getCountries();
        getPaymentData()
    }, []);

    useEffect(() => {
        getButton();
    }, [i18n.language]);

    const getButton = () =>{
        setButtonState({ label: t('experience.save-changes'), disabled: false })
    }

    const getPaymentData = () => {
        PaymentDataAPI.getData(localStorage.getItem("token")).then((res) => {
            console.log(res)
            setEntity(res)
        })
    };

    const getCountries = () => {
        CountriesAPI.getCountries({stripe: true, lang: i18n.language}).then((res) => {
            console.log(res)
            if (res) {
                const items = res.map((item) =>
                    <option key={item.id} value={item.id}>{ i18n.language=="ES" ? item.name_es : item.name_en}</option>
                );
                setCountries(items)
            }
        })
    }
    useEffect(() => {
        getCountries()
    }, [i18n.language]);
    
    const getBanks = () => {
        BanksAPI.getBanks({}).then((res) => {
            const items = res?.map((item) =>
                <option key={item.id} value={item.id}>{item.name}</option>
            );
            setBanks(items)
        })
    };

    const setSuccess = () => {
        let message = t('translator-profile.successful-changes')
        setButtonState({ label: t('experience.save-changes'), disabled: false })
        setResponse(
            <Alert variant={'success'} >
                {message}
            </Alert>
        )
    }

    const setFail = () => {
        let message;
        message = t('translator-profile.changes-error')

        setResponse(
            <Alert variant={'danger'} >
                {message}
            </Alert>
        )
    }



    const saveChanges = (values) => {
        console.log(values)
        setButtonState({ ...buttonState, ...{ label: t('experience.saving'), disabled: false } })

        if(values.bank_id==""){
            values.bank_id=null
        }
        
        if (!entity) {
            PaymentDataAPI.createData({ ...values, user_id: localStorage.getItem("userId") }, localStorage.getItem("token")).then((res) => {
                setSuccess()
            }).catch((err) => {
                console.log(err)
                setFail()
            })

        } else {
            PaymentDataAPI.updateData({ ...values, user_id: localStorage.getItem("userId") }, localStorage.getItem("token")).then((res) => {
                setSuccess()
            }).catch((err) => {
                console.log(err)
                setFail()
            })
        }
    }


    const validationSchema = Yup.object().shape({

        bank: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(100, t('max-char', {num: 100}))
            .required("*Este campo es obligatorio"),
        /* bank_id: Yup.string()
            .min(1, "*Debes elegir un campo"),
            //.required("*Este campo es obligatorio"), */
        account_type: Yup.string()
            .min(1, t('required-value'))
            .required("*Este campo es obligatorio"),
        account_number: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(20, t('max-char', {num: 20}))
            .required("*Este campo es obligatorio"),
        country_id: Yup.string()
            .min(1, t('required-value'))
            .required(t('required-field')),
            //.required("*Este campo es obligatorio"),
        owner_name: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(100, t('max-char', {num: 100}))
            .required("*Este campo es obligatorio"),
            //.required("*Este campo es obligatorio"),
        document_type: Yup.string()
            .min(1, t('required-value'))
            .required("*Este campo es obligatorio"),
            //.required("*Este campo es obligatorio"),
        document_number: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(16, t('max-char', {num: 16}))
            .required("*Este campo es obligatorio"),
            //.required("*Este campo es obligatorio"),
        /* payoneer_account: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(20, t('max-char', {num: 20}))
            .required("*Este campo es obligatorio"),
            //.required("*Este campo es obligatorio"), */

    });

    const formik = useFormik({
        initialValues: {
            bank: entity?.bank ? entity.bank : "",
            bank_id: entity?.bank_id ? entity.bank_id : "",
            account_type: entity?.account_type ? entity.account_type : "",
            account_number: entity?.account_number ? entity.account_number : "",
            country_id: entity.country_id ? entity.country_id : "",
            owner_name: entity?.owner_name ? entity.owner_name : "",
            document_type: entity?.document_type ? entity.document_type : "",
            document_number: entity?.document_number ? entity.document_number : "",
            //payoneer_account: entity?.payoneer_account ? entity.payoneer_account : ""
        },
        onSubmit: values => {
            saveChanges({ ...values })
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        enableReinitialize: true
    });



    return (
        <div>

            <Title>{t('bank-info.personal-information')}</Title>

            <Alert variant="primary">
                {t('bank-info.payoneer-label-1')}<a target="_blank" href="https://stripe.com/global">{t('bank-info.payoneer-link')}</a>{t('bank-info.payoneer-label-2')}
                <p>{t('bank-info.payoneer-account-label')}<a target="_blank" href="https://www.payoneer.com/resources/payoneer-account/">{t('bank-info.payoneer-account-link')}</a></p>
            </Alert>

            <Form onSubmit={formik.handleSubmit}>

                {/* <Form.Group>
                    <Label>{t('bank-info.payoneer-account')}</Label>
                    <Control
                        id="payoneer_account"
                        type="text"
                        value={formik.values.payoneer_account}
                        onChange={(e) => {
                            formik.setFieldTouched('payoneer_account');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.payoneer_account && formik.errors.payoneer_account ? (
                    <div className="alert alert-danger">{formik.errors.payoneer_account}</div>
                ) : null} */}

                <hr />

                <Form.Group>
                    <Label>{t('bank-info.bank')}</Label>
                    <Form.Control
                        id="bank"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('bank');
                            formik.handleChange(e);
                        }}
                        value={formik.values.bank} />
                </Form.Group>
                {formik.touched.bank && formik.errors.bank ? (
                    <div className="alert alert-danger">{formik.errors.bank}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('bank-info.account-type')}</Label>
                    <Form.Control
                        as="select"
                        id="account_type"
                        name="account_type"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('account_type');
                            formik.handleChange(e);
                        }}
                        value={formik.values.account_type} >
                        <option value="">{t('select')}</option>
                        <option value="0">{t('bank-info.account-savings')}</option>
                        <option value="1">{t('bank-info.account-checking')}</option>

                    </Form.Control>
                </Form.Group>
                {formik.touched.account_type && formik.errors.account_type ? (
                    <div className="alert alert-danger">{formik.errors.account_type}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('bank-info.account-number')}</Label>
                    <Form.Control
                        id="account_number"
                        type="number"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('account_number');
                            formik.handleChange(e);
                        }}
                        value={formik.values.account_number} />
                </Form.Group>


                {formik.touched.account_number && formik.errors.account_number ? (
                    <div className="alert alert-danger">{formik.errors.account_number}</div>
                ) : null}


                <Form.Group className="outline">
                    <Label>{t('bank-info.account-country')}</Label>
                    <Form.Control
                        as="select"
                        id="country_id"
                        name="country_id"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('country_id');
                            formik.handleChange(e);
                        }}
                        value={formik.values.country_id} >
                        <option value="">{t('select')}</option>
                        {countries}
                    </Form.Control>
                </Form.Group>

                {formik.touched.country_id && formik.errors.country_id ? (
                    <div className="alert alert-danger">{formik.errors.country_id}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('bank-info.owner-name')}</Label>
                    <Form.Control
                        id="owner_name"
                        type="text"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('owner_name');
                            formik.handleChange(e);
                        }}
                        value={formik.values.owner_name} />
                </Form.Group>
                {formik.touched.owner_name && formik.errors.owner_name ? (
                    <div className="alert alert-danger">{formik.errors.owner_name}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('bank-info.owner-document')}</Label>

                    <div className="document-form">
                        <Form.Control
                            as="select"
                            id="document_type"
                            name="document_type"
                            className="form-control input-lg"
                            onChange={e => {
                                formik.setFieldTouched('document_type');
                                formik.handleChange(e);
                            }}
                            value={formik.values.document_type} >
                            <option value="">{t('select')}</option>
                            <option value="0">{t('bank-info.id-number')}</option>
                            <option value="1">{t('bank-info.id-number-foreign')}</option>

                        </Form.Control>

                        <Form.Control
                            id="document_number"
                            type="document_number"
                            className="form-control input-lg"
                            onChange={e => {
                                formik.setFieldTouched('document_number');
                                formik.handleChange(e);
                            }}
                            value={formik.values.document_number} />
                    </div>
                </Form.Group>


                {formik.touched.document_type && formik.errors.document_type ? (
                    <div className="alert alert-danger">{formik.errors.document_type}</div>
                ) : null}

                {formik.touched.document_number && formik.errors.document_number ? (
                    <div className="alert alert-danger">{formik.errors.document_number}</div>
                ) : null}


                

                <Submit
                    disabled={buttonState.disabled}
                    type="button"
                    type="submit"
                >
                    {buttonState.label}
                </Submit>

            </Form>

            {response}

        </div>
    )
}
