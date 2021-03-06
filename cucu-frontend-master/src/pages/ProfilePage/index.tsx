/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Alert,
  Modal,
} from "react-bootstrap";

import {
  Title,
  PasswordInfo,
  WellContainer,
  PasswordRecover,
  RowRecover,
  Label,
  ControlPassword,
  ShowPassword,
  Control,
  Submit,
  SubmitButton
}
  from './styles'

import * as CountriesAPI from '../../api/countries';

import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import PasswordModal from "../../components/PasswordModal";

import * as UsersAPI from '../../api/users';
import { useTranslation } from 'react-i18next';

const baseUri = process.env.REACT_APP_API_URL;

interface Props {
  counter: number;
  reduxIncreaseCounter: () => void;
  reduxDecreaseCounter: () => void;
}

function ProfilePage({
  reduxIncreaseCounter,
  reduxDecreaseCounter,
  counter,
}: Props) {
  const [image, setImage] = useState<any>(null);
  const [countries, setCountries] = useState(null)
  const [showModal, setShowModal] = useState(false);

  const { t, i18n } = useTranslation();

  const [buttonState, setButtonState] = useState({ label: t('translator-profile.save-changes'), disabled: false })
  const [response, setResponse] = useState<any>(null)


  const [entity, setEntity] = useState({
    firstname: "",
    lastname: "",
    document: "",
    email: "",
    phone: "",
    password: "",
    description: "",
    country_id: "",
    city: "",
    total_services: "",
    total_transactions: "",
    role: ""
  });

  const validationSchema = Yup.object().shape({

    firstname: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field')),
    lastname: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field')),
    document: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .max(15, t('max-char', { num: 15 })),
      //.required(t('required-field')),
    email: Yup.string()
      .email(t('invalid-email'))
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field')),
    phone: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field'))
      .matches(/^[\+\d]?(?:[\d-.\s()]*)$/, t('invalid-phone')),
    country_id: Yup.string()
      .min(1, t('required-value'))
      .required(t('required-field')),
    city: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field')),

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
      city: entity.city ? entity.city : "",

    },
    onSubmit: values => {
      saveChanges({ ...values })
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    enableReinitialize: true
  });

  const { register, handleSubmit, watch, errors } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getButton();
    getCountries();
  }, [i18n.language]);

  const getButton = () =>{
      setButtonState({ label: t('experience.save-changes'), disabled: false })
  }

  const getCountries = () => {
    CountriesAPI.getCountries({lang: i18n.language}).then((res) => {
      //console.log(res)
      if (res) {
        const items = res.map((item) =>
          <option key={item.id} value={item.id}>{ i18n.language=="ES" ? item.name_es : item.name_en}</option>
        );
        setCountries(items)
      }
    })
  }

  const getProfile = () => {
    UsersAPI.getUser({}, localStorage.getItem("userId"), localStorage.getItem("token")).then((res) => {
      //console.log(res.user)
      setEntity(res.user)
      localStorage.setItem("image_url", res.user?.image_url);
      getImage()
    })
  };

  const handleFileChange = async (event) => {
    const res = await UsersAPI.saveFile(event.target.files[0])
    //console.log(res.image.Location)
    UsersAPI.updateUser({ image_url: res.image?.Location }, localStorage.getItem("token")).then((res) => {
      getProfile()
    }).catch((err) => {
      //console.log(err)
    })
  }

  const getImage = () => {
    let url = localStorage.getItem("image_url")
    if (url && url != "null") {
      setImage(url)
    } else {
      setImage("/assets/images/no_avatar_default.png")
    }
  }

  const saveChanges = (values) => {
    //console.log(values)
    setButtonState({ ...buttonState, ...{ label: t('translator-profile.saving'), disabled: false } })
    UsersAPI.updateUser(values, localStorage.getItem("token")).then((res) => {
      let message = t('translator-profile.successful-changes')
      setButtonState({ label: t('translator-profile.save-changes'), disabled: false })
      setResponse(
        <Alert variant={'success'} >
          {message}
        </Alert>
      )
    }).catch((err) => {
      //console.log(err)
      let message;
      message = t('translator-profile.changes-error')
      if(err.response?.data?.code=="MAIL_IN_USE"){
          message = t('translator-profile.mail-in-use')
      }
      setButtonState({ label: t('translator-profile.save-changes'), disabled: false })
      setResponse(
        <Alert variant={'danger'} >
          {message}
        </Alert>
      )
    })
  }


  useEffect(() => {
    getCountries();
    getProfile();
  }, []);

  return (
    <>
      <Header></Header>

      <Container className="themed-container profile-client-container">
        <RowRecover className="layout-content">
          <Col className="col-md-12">
            <Title>{t('my-profile.profile')}</Title>
            <PasswordRecover>
              <Row>
                <Col className="col-md-12">
                  <WellContainer>
                    <div className="row-border col-padding container-profile">
                      <Col>
                        <div className="userIconTra">
                          <div>
                            <img
                              className="image-profile"
                              src={image}
                              alt="logo"
                            />
                            {JSON.stringify(showModal)}
                            <div className="upload">
                              <label htmlFor="file" className="upload-btn-label">
                                <i className="fa fa-pencil"></i>
                              </label>
                              <input type="file" id="file" accept="image/*" className="upload-btn" onChange={handleFileChange} />
                            </div>
                          </div>
                          <div>
                            <div className="name-container">
                              <p className="name-profile">
                                {entity?.firstname} {entity?.lastname}
                              </p>

                              {/* <p className="enterprise">. NativApps S.A.S</p> */}
                            </div>
                            <p className="email-text">{entity?.email}</p>
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <Row>
                          <Col>
                            <p className="services">{entity.total_services} {t('my-profile.services')}</p>
                            <p className="cucucreditos">
                              ${entity.total_transactions} {t('my-profile.invested-cucu')}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </div>
                    <Row className="col-padding">
                      <Col className="col-md-3 menu-profile ">
                        <div className="item-menu">
                          <p className="text-item-menu">{t('my-profile.my-profile')}</p>
                        </div>
                        {/* <div className="item-menu">
                          <p className="text-item-menu">M??todos de pago</p>
                        </div>
                        <div className="item-menu">
                          <p className="text-item-menu">Cucucr??ditos</p>
                        </div> */}
                      </Col>
                      <Col className="col-padding item-active-profile">
                        <Title>{t('my-profile.my-profile')}</Title>
                        <Form>
                          <Form.Group>
                            <Label className="label-filter">{t('my-profile.first-name')}</Label><span className="required">*</span>
                            <Control
                              type="text"
                              id="firstname"
                              onChange={e => {
                                formik.setFieldTouched('firstname');
                                formik.handleChange(e);
                              }}
                              value={formik.values.firstname}
                            />
                          </Form.Group>
                          {formik.touched.firstname && formik.errors.firstname ? (
                            <div className="alert alert-danger">{formik.errors.firstname}</div>
                          ) : null}

                          <Form.Group>
                            <Label className="label-filter">{t('my-profile.last-name')}</Label><span className="required">*</span>
                            <Control
                              type="text"
                              id="lastname"
                              onChange={e => {
                                formik.setFieldTouched('lastname');
                                formik.handleChange(e);
                              }}
                              value={formik.values.lastname}
                            />
                          </Form.Group>
                          {formik.touched.lastname && formik.errors.lastname ? (
                            <div className="alert alert-danger">{formik.errors.lastname}</div>
                          ) : null}

                          <Form.Group>
                            <Label className="label-filter">
                              { entity?.role=="4" ? t('my-profile.document-company')+" "+t('optional') : t('my-profile.document')+" "+t('optional') }
                            </Label>
                            <Control type="text"
                              id="document"
                              onChange={e => {
                                formik.setFieldTouched('document');
                                formik.handleChange(e);
                              }}
                              value={formik.values.document}
                            />
                          </Form.Group>
                          {formik.touched.document && formik.errors.document ? (
                            <div className="alert alert-danger">{formik.errors.document}</div>
                          ) : null}

                          <Form.Group>
                            <Label className="label-filter">
                              {t('my-profile.email')}
                            </Label><span className="required">*</span>
                            <Control
                              type="text"
                              id="email"
                              onChange={e => {
                                formik.setFieldTouched('email');
                                formik.handleChange(e);
                              }}
                              value={formik.values.email}
                            />
                          </Form.Group>
                          {formik.touched.email && formik.errors.email ? (
                            <div className="alert alert-danger">{formik.errors.email}</div>
                          ) : null}

                          <Form.Group>
                            <Label className="label-filter">{t('my-profile.phone')}</Label><span className="required">*</span>
                            <Control
                              type="text"
                              id="phone"
                              onChange={e => {
                                formik.setFieldTouched('phone');
                                formik.handleChange(e);
                              }}
                              value={formik.values.phone}
                            />
                          </Form.Group>

                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="alert alert-danger">{formik.errors.phone}</div>
                          ) : null}

                          <Form.Group className="outline">
                            <Label>{t('translator-profile.country')}</Label><span className="required">*</span>
                            <Control
                              as="select"
                              id="country_id"
                              name="country_id"
                              className="form-control input-lg"
                              onChange={e => {
                                formik.setFieldTouched('country_id');
                                formik.handleChange(e);
                              }}
                              value={formik.values.country_id}
                            >
                              <option value="">{t('select')}</option>
                              {countries}
                            </Control>
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
                            <Label className="label-filter">{t('my-profile.password')} {t('optional')}</Label>
                            <InputGroup>
                              <ControlPassword
                                type="password"
                                value="password"
                                disabled
                              />
                              <InputGroup.Prepend>
                                <ShowPassword onClick={()=>setShowModal(true)}>
                                  {t('my-profile.switch')}
                                </ShowPassword>
                              </InputGroup.Prepend>
                            </InputGroup>
                          </Form.Group>
                          <Form.Group>
                            <Label className="label-filter">{t('my-profile.about-me')} {t('optional')}</Label>
                            <Control type="text"
                              id="description"
                              onChange={e => {
                                formik.setFieldTouched('description');
                                formik.handleChange(e);
                              }}
                              value={formik.values.description}
                            />
                          </Form.Group>
                          {formik.touched.description && formik.errors.description ? (
                            <div className="alert alert-danger">{formik.errors.description}</div>
                          ) : null}

                          {formik.submitCount && !formik.isValid ? (
                              <div className="alert alert-danger">{t('all-required-error')}</div>
                          ) : null}

                         <p><small><b><span className="required">*</span>{t('required-fields')}</b></small></p>

                          <Submit
                            disabled={buttonState.disabled}
                            type="button"
                            onClick={() => formik.submitForm()}
                          >
                            {buttonState.label}
                          </Submit>
                          {response}
                        </Form>
                        <Link className="disabled-account" to="#">
                          {t('my-profile.disable account')}
                        </Link>
                      </Col>
                    </Row>
                  </WellContainer>
                </Col>
              </Row>
            </PasswordRecover>
          </Col>
        </RowRecover>
        <PasswordModal
          show={showModal}
          closeModal={()=>{
            setShowModal(false)
          }}
        ></PasswordModal>
      </Container>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    counter: state.counter.counter,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    reduxIncreaseCounter: () =>
      dispatch({
        type: "INCREASE_COUNTER",
        value: 1,
      }),
    reduxDecreaseCounter: () =>
      dispatch({
        type: "DECREASE_COUNTER",
        value: 1,
      }),
  };
};

ProfilePage.propTypes = {
  counter: PropTypes.number.isRequired,
  reduxIncreaseCounter: PropTypes.func.isRequired,
  reduxDecreaseCounter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
