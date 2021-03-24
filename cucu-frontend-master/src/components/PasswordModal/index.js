/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from 'yup';

import {
  Form,
  InputGroup,
  Alert,
  Modal,
} from "react-bootstrap";

import {
  PasswordInfo,
  ControlPassword,
  ShowPassword,
  SubmitButton
}
from '../../pages/ProfilePage/styles'

import { useFormik } from 'formik';

import * as UsersAPI from '../../api/users';
import { useTranslation } from 'react-i18next';

export default function PasswordModal(props) {

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const [response, setResponse] = useState(null)
  const password = useRef({});

  const validationSchema = Yup.object().shape({
    old_password: Yup.string()
      .min(3, t('min-char', { num: 3 }))
      .required(t('required-field')),
    password: Yup.string()
      .min(3, t('min-char', {num: 3}))
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$¡!%*¿?+\-\\&#"'/&(){}])([A-Za-z\d$@$¡!%*¿?+\-\\&#"'/&(){}]|[^ ]){8,}$/i , t('forgot-password.password-criteria') ),
    password_repeat: Yup.string()
    .oneOf([Yup.ref('password'), null], t('forgot-password.passwords-different'))
    .required(t('required-field')),
  });


  const formik = useFormik({
    initialValues: {
      old_password: "",
      password: "",
      password_repeat: ""
    },
    onSubmit: values => {
        saveChanges({ ...values })
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    enableReinitialize: true
});


  const saveChanges = (values) => {
    //console.log(values);
    UsersAPI.updatePassword({newPassword: values.password, oldPassword: values.old_password}, localStorage.getItem("token")).then((res) => {
      let message = t('translator_profile.update-password-success')
      setResponse(
        null
      )
      props.closeModal()
      formik.resetForm()
    }).catch((err) => {
      //console.log(err)
      let message;
      message = t('translator_profile.update-password-error')
      setResponse(
        <Alert variant={'danger'} >
          {message}
        </Alert>
      )
      /* props.closeModal()
      formik.resetForm() */
    })
  };


  return (
    <div>

      <Modal show={props.show} onHide={()=>{props.closeModal(); setResponse(null); formik.resetForm()}}>
        <Modal.Header closeButton>
          <Modal.Title>{t('my-profile.change-account')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="info-change-password">
            {t('my-profile.type-password')}
          </p>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group>
              <InputGroup>
                <ControlPassword
                  type={showOldPassword ? "text" : "password"}
                  name="old_password"
                  placeholder={t('my-profile.current-password')}
                  id="old_password"
                  value={formik.values.old_password}
                  onChange={(e) => {
                    formik.setFieldTouched('old_password');
                    formik.handleChange(e)
                  }}
                />
                <InputGroup.Prepend>
                  <ShowPassword
                    onClick={() => {
                      setShowOldPassword(!showOldPassword);
                    }}
                  >
                    {showOldPassword ? t('hide') : t('show')}
                  </ShowPassword>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            {formik.touched.old_password && formik.errors.old_password ? (
              <div className="alert alert-danger">{formik.errors.old_password}</div>
            ) : null}
            <Form.Group>
              <InputGroup>
                <ControlPassword
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t('my-profile.new-password')}
                  id="password"
                  value={formik.values.password}
                  onChange={(e) => {
                      formik.setFieldTouched('password');
                      formik.handleChange(e)
                  }}
                />
                <InputGroup.Prepend>
                  <ShowPassword
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? t('hide') : t('show')}
                  </ShowPassword>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            {formik.touched.password && formik.errors.password ? (
              <div className="alert alert-danger">{formik.errors.password}</div>
            ) : null}
            <PasswordInfo>
              {t('password-criteria')}
            </PasswordInfo>
            <Form.Group>
              <InputGroup>
                <ControlPassword
                  type={showVerifyPassword ? "text" : "password"}
                  name="password_repeat"
                  placeholder={t('my-profile.confirm-password')}
                  id="password_repeat"
                  value={formik.values.password_repeat}
                  onChange={(e) => {
                    formik.setFieldTouched('password_repeat');
                    formik.handleChange(e)
                  }}
                />
                <InputGroup.Prepend>
                  <ShowPassword
                    onClick={() => {
                      setShowVerifyPassword(!showVerifyPassword);
                    }}
                  >
                    {showVerifyPassword ? t('hide') : t('show')}
                  </ShowPassword>
                </InputGroup.Prepend>
              </InputGroup>
            </Form.Group>
            {formik.touched.password_repeat && formik.errors.password_repeat ? (
              <div className="alert alert-danger">{formik.errors.password_repeat}</div>
            ) : null}
            <SubmitButton type="submit">{t('change-password')}</SubmitButton>
            {response}
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  )
}
