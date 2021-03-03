import React, { useState, useEffect } from 'react'
import { Form, InputGroup, Alert } from "react-bootstrap";

import { Link, useHistory, useLocation } from "react-router-dom";
import {
    Label,
    Submit,
    ControlPassword,
    ShowPassword,
    Control,
    Title
} from "./styles"

import * as CountriesAPI from '../../api/countries';

import NumberFormat from 'react-number-format';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import * as UsersAPI from '../../api/users';
import * as CitiesAPI from '../../api/cities';
import ConfirmationModal from '../ConfirmationModal';
import { useTranslation } from 'react-i18next';

export default function TranslatorProfileForm() {

    const [entity, setEntity] = useState({
        firstname: "",
        lastname: "",
        document: "",
        email: "",
        number: "",
        password: "",
        description: "",
        country: "",
        city: "",
        nationality: "",
        address_1: "",
        address_2: "",
        address_additional: "",
        labor_months: "",
        rate_hour: "",
        rate_minute: ""
    });
    const { t, i18n } = useTranslation();

    const [showPassword, setShowPassword] = useState(false);
    const [buttonState, setButtonState] = useState({ label: t('translator-profile.save-changes'), disabled: false })
    const [countries, setCountries] = useState(null)
    const [cities, setCities] = useState(null)
    const [response, setResponse] = useState(null)

    const [modalShow, setModalShow] = useState(false);
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        getProfile();
        getCountries();
    }, []);

    useEffect(() => {
        getCountries()
        getButton()
    }, [i18n.language]);

    const getButton = () =>{
        setButtonState({ label: t('experience.save-changes'), disabled: false })
    }

    const getProfile = () => {
        UsersAPI.getUser({}, localStorage.getItem("userId")).then((res) => {
            console.log(res.user)
            setEntity(res.user)
        })
    };

    const getCountries = () => {
        CountriesAPI.getCountries({lang: i18n.language}).then((res) => {
            console.log(res)
            if (res) {
                const items = res.map((item) =>
                    <option key={item.id} value={item.id}>{ i18n.language=="ES" ? item.name_es : item.name_en}</option>
                );
                setCountries(items)
            }
        })
    }

    /* const getCities = (country) => {
        console.log(country)
        CitiesAPI.getCities({ country_id: country }).then((res) => {
            console.log(res)
            if (res) {
                const items = res?.map((item) =>
                    <option key={item.id} value={item.id}>{item.name}</option>
                );
                setCities(items)
                console.log(entity.city_id)
                if(country == entity.country_id){
                    formik.setFieldValue("city_id", entity.city_id)
                }else{
                    formik.setFieldValue("city_id", "")
                }
            }
        })
    } */


    const saveChanges = (values) => {
        console.log(values)
        setButtonState({ ...buttonState, ...{ label: t('translator-profile.saving'), disabled: false } })
        UsersAPI.updateUser(values, localStorage.getItem("token")).then((res) => {

            if(location.state=="initial"){
                history.push( { pathname: "/profile-translator-edit/experience", state: "initial" } );
            }

            let message = t('translator-profile.successful-changes')
            setButtonState({ label: t('translator-profile.save-changes'), disabled: false })
            setResponse(
                <Alert variant={'success'} >
                    {message}
                </Alert>
            )
        }).catch((err) => {
            console.log(err)
            let message;
            message = t('translator-profile.changes-error')

            setResponse(
                <Alert variant={'danger'} >
                    {message}
                </Alert>
            )
        })
    }

    const disableAccount = () => {
        UsersAPI.disableUser(localStorage.getItem("token")).then((res) => {
            let message = t('translator-profile.successful-disable')
            setResponse(
                <Alert variant={'success'} >
                    {message}
                </Alert>
            )
            setModalShow(false)
        }).catch((err) => {
            console.log(err)
            let message;
            message = t('translator-profile.changes-error')
            setResponse(
                <Alert variant={'danger'} >
                    {message}
                </Alert>
            )
            setModalShow(false)
        })
    }

    const validationSchema = Yup.object().shape({

        firstname: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        lastname: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        document: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .max(15, t('max-char', {num: 15})),
            //.required(t('required-field')),
        email: Yup.string()
            .email(t('invalid-email'))
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        phone: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field'))
            .matches(/^[\+\d]?(?:[\d-.\s()]*)$/, t('invalid-phone')),
        password: Yup.string()
            .min(3, t('min-char', {num: 3})),
        //.required(t('required-field')),
        /* description: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')), */
        country_id: Yup.string()
            .min(1, t('required-value'))
            .required(t('required-field')),
        /* city_id: Yup.string()
            .min(1, t('required-value'))
            .required(t('required-field'))
            .nullable(),
        country: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')), */
        city: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        nationality: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        address_1: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        address_2: Yup.string()
            .min(3, t('min-char', {num: 3})),
        //.required(t('required-field')),
        address_additional: Yup.string()
            .min(3, t('min-char', {num: 3})),
        labor_months: Yup.string()
            .required(t('required-field'))
            .min(1, t('min-char', {num: 3}))
            .max(5, t('max-char', {num: 5})),
        rate_hour: Yup.number()
            .required(t('required-field'))
            .min(40, t('min-value', {num: 40}))
            .max(500,  t('max-value', {num: 500})),
        rate_minute: Yup.number()
            .required(t('required-field'))
            .min(1, t('min-value', {num: 1}))
            .max(10,  t('max-value', {num: 10})),

        //.required(t('required-field')),

    });

    const formik = useFormik({
        initialValues: {
            firstname: entity.firstname ? entity.firstname : "",
            lastname: entity.lastname ? entity.lastname : "",
            document: entity.document ? entity.document : "",
            email: entity.email ? entity.email : "",
            phone: entity.phone ? entity.phone : "",
            password: entity.password ? entity.password : "",
            description: entity.description ? entity.description : "",
            country_id: entity.country_id ? entity.country_id : "",
            /* city_id: entity.city_id ? entity.city_id : "",
            country: entity.country ? entity.country : "", */
            city: entity.city ? entity.city : "",
            nationality: entity.nationality ? entity.nationality : "",
            address_1: entity.address_1 ? entity.address_1 : "",
            address_2: entity.address_2 ? entity.address_2 : "",
            address_additional: entity.address_additional ? entity.address_additional : "",
            labor_months: entity.labor_months ? entity.labor_months : "",
            rate_hour: entity.rate_hour ? entity.rate_hour : "",
            rate_minute: entity.rate_minute ? entity.rate_minute : ""

        },
        onSubmit: values => {
            saveChanges({ ...values })
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        enableReinitialize: true
    });


    /* useEffect(() => {
        getCities(formik.values.country_id)
    }, [formik.values.country_id]); */




    return (
        <div>         

            <Title>{t('translator-profile.my-account')}</Title>

            { entity?.approved_translator == "0" ?                
            <Alert variant="primary" className="alert-profile">
                {t('must-fill-profile')}
            </Alert>
            :null
            }

            <Form onSubmit={formik.handleSubmit}>
                <Form.Group>
                    <Label>{t('translator-profile.firstname')}</Label><span className="required">*</span>
                    <Control
                        id="firstname"
                        type="text"
                        maxlength="100"
                        value={formik.values.firstname}
                        onChange={(e) => {
                            formik.setFieldTouched('firstname');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.firstname && formik.errors.firstname ? (
                    <div className="alert alert-danger">{formik.errors.firstname}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.lastname')}</Label><span className="required">*</span>
                    <Control
                        id="lastname"
                        type="text"
                        maxlength="100"
                        value={formik.values.lastname}
                        onChange={(e) => {
                            formik.setFieldTouched('lastname');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.lastname && formik.errors.lastname ? (
                    <div className="alert alert-danger">{formik.errors.lastname}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.document')}</Label>
                    <Form.Control
                        id="document"
                        type="number"
                        maxlength="100"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('document');
                            formik.handleChange(e);
                        }}
                        value={formik.values.document} />
                </Form.Group>


                {formik.touched.document && formik.errors.document ? (
                    <div className="alert alert-danger">{formik.errors.document}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.email')}</Label><span className="required">*</span>
                    <Form.Control
                        disabled
                        id="email"
                        type="text"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('email');
                            formik.handleChange(e);
                        }}
                        value={formik.values.email} />
                </Form.Group>
                {formik.touched.email && formik.errors.email ? (
                    <div className="alert alert-danger">{formik.errors.email}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.phone')}</Label><span className="required">*</span>
                    <Form.Control
                        id="phone"
                        type="phone"
                        maxlength="17"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.setFieldTouched('phone');
                            formik.handleChange(e);
                        }}
                        value={formik.values.phone} />
                </Form.Group>


                {formik.touched.phone && formik.errors.phone ? (
                    <div className="alert alert-danger">{formik.errors.phone}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.password')}</Label>
                    <p>
                        <small>{t('translator-profile.password-label')}</small>
                    </p>
                    <InputGroup>
                        <ControlPassword
                            type={showPassword ? "text" : "password"}
                            onChange={(e) =>
                                formik.setFieldTouched('password')
                            }
                        />
                        <InputGroup.Prepend>
                            <ShowPassword
                                onClick={() => {
                                    setShowPassword(!showPassword)
                                }}
                            >
                                {t('show')}
                                </ShowPassword>
                        </InputGroup.Prepend>
                    </InputGroup>
                </Form.Group>

                {formik.touched.password && formik.errors.password ? (
                    <div className="alert alert-danger">{formik.errors.password}</div>
                ) : null}

                <Form.Group className="outline">
                    <Label>{t('translator-profile.country')}</Label><span className="required">*</span>
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
                    <Label>{t('translator-profile.city')}</Label><span className="required">*</span>
                    <Control
                        id="city"
                        type="text"
                        maxlength="100"
                        value={formik.values.city}
                        onChange={(e) => {
                            formik.setFieldTouched('city');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.city && formik.errors.city ? (
                    <div className="alert alert-danger">{formik.errors.city}</div>
                ) : null}


                <Form.Group>
                    <Label>{t('translator-profile.nationality')}</Label><span className="required">*</span>
                    <Control
                        id="nationality"
                        type="text"
                        maxlength="100"
                        value={formik.values.nationality}
                        onChange={(e) => {
                            formik.setFieldTouched('nationality');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.nationality && formik.errors.nationality ? (
                    <div className="alert alert-danger">{formik.errors.nationality}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.address_1')}</Label><span className="required">*</span>
                    <Control
                        id="address_1"
                        type="text"
                        maxlength="80"
                        value={formik.values.address_1}
                        onChange={(e) => {
                            formik.setFieldTouched('address_1');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.address_1 && formik.errors.address_1 ? (
                    <div className="alert alert-danger">{formik.errors.address_1}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.address_2')}</Label>
                    <Control
                        id="address_2"
                        type="text"
                        maxlength="80"
                        value={formik.values.address_2}
                        onChange={(e) => {
                            formik.setFieldTouched('address_2');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.address_2 && formik.errors.address_2 ? (
                    <div className="alert alert-danger">{formik.errors.address_2}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.address_additional')}</Label>
                    <Control
                        id="address_additional"
                        type="text"
                        maxlength="5"
                        value={formik.values.address_additional}
                        onChange={(e) => {
                            formik.setFieldTouched('address_additional');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.address_additional && formik.errors.address_additional ? (
                    <div className="alert alert-danger">{formik.errors.address_additional}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.experience')}</Label><span className="required">*</span>
                    <Control
                        id="labor_months"
                        type="number"
                        value={formik.values.labor_months}
                        onChange={(e) => {
                            formik.setFieldTouched('labor_months');
                            formik.handleChange(e)
                        }}
                    />
                </Form.Group>
                {formik.touched.labor_months && formik.errors.labor_months ? (
                    <div className="alert alert-danger">{formik.errors.labor_months}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.value_hour')}</Label><span className="required">*</span>
                    <NumberFormat
                        id="rate_hour"
                        className="form-control"
                        value={formik.values.rate_hour}
                        onValueChange={e => {
                            formik.setFieldValue("rate_hour", e.value)
                        }}
                        thousandSeparator={true} prefix={'$'}
                    />
                </Form.Group>
                {formik.touched.rate_hour && formik.errors.rate_hour ? (
                    <div className="alert alert-danger">{formik.errors.rate_hour}</div>
                ) : null}

                <Form.Group>
                    <Label>{t('translator-profile.value_minute')}</Label><span className="required">*</span>
                    <NumberFormat
                        id="rate_minute"
                        className="form-control"
                        value={formik.values.rate_minute}
                        onValueChange={e => {
                            formik.setFieldValue("rate_minute", e.value)
                        }}
                        thousandSeparator={true} prefix={'$'}
                    />
                </Form.Group>
                {formik.touched.rate_minute && formik.errors.rate_minute ? (
                    <div className="alert alert-danger">{formik.errors.rate_minute}</div>
                ) : null}

                {formik.submitCount && !formik.isValid ? (
                    <div className="alert alert-danger">{t('all-required-error')}</div>
                ) : null}

                
               <p><small><b><span className="required">*</span>{t('required-fields')}</b></small></p>

                <Submit
                    disabled={buttonState.disabled}
                    type="button"
                    type="submit"
                >
                    {location.state=="initial" ? t('next') : buttonState.label}
                </Submit>

            </Form>

            <Link className="disabled-account" to="#" onClick={() => setModalShow(true)}>
                {t('translator-profile.disable-account')}
            </Link>

            <ConfirmationModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                setConfirm={() => disableAccount()}
                title={t('messages.disable-title')}
                body={ t('messages.disable-body')}
                confirm={ t('messages.disable-confirm')}
                cancel={t('messages.disable-cancel')}
            ></ConfirmationModal>

            {response}

        </div>
    )
}
