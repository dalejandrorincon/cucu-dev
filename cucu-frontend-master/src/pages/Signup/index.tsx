import React, { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Form, Alert, InputGroup } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Logo,
  Title,
  SignupInfo,
  BackToLoginLink,
  ForgotPasswordLink,
  Label,
  Control,
  ControlPassword,
  OptionActive,
  Option,
  Submit,
  Signup,
  ShowPassword,
  PasswordInfo,
  FormCheck,
  FormCheckLabel
} from "./styles"

import * as UsersAPI from '../../api/users';
import * as AuthAPI from '../../api/auth';
import { connectSocket } from "../../utils/constants"
import LanguageSelector from "../../components/LanguageSelector";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [role, setRole] = useState("3");
  const [type, setType] = useState("client");
  const { register, handleSubmit, watch, errors } = useForm();
  const history = useHistory();
  const password = useRef({});
  password.current = watch("password", "");
  const [response, setResponse] = useState<any>(null)
  const { t, i18n } = useTranslation();
  const [buttonState, setButtonState] = useState({ label:  t('sign-up-client.create-account'), disabled: false })

  const onSubmit = (data: any) => {
    console.log(role)
    let userRole = role
    if(role=="3" && type=="enterprise"){
      userRole = "4"
    }

    saveChanges({ ...data, role: userRole })
  };

  const saveChanges = (values) => {
    console.log(values)
    setButtonState({ ...buttonState, ...{ label: t('sign-up-client.creating'), disabled: false } })
    UsersAPI.createUser(values).then((res) => {
        setButtonState({ label: t('sign-up-client.create-account'), disabled: false })
        setResponse(null)
        AuthAPI.login(values).then((res)=>{
          localStorage.setItem("token", res.token);
          localStorage.setItem("userId", res.user.id);
          localStorage.setItem("role", res.user.role);
          localStorage.setItem("approved", res.user.approved_translator);
          localStorage.setItem(
            "userName",
            res.user.firstname + " " + res.user.lastname
          );
          localStorage.setItem("image_url", res.user.image_url)
          connectSocket()
          if (res.user.role == 3 || res.user.role == 4) {
            history.push("/translators");
          } else {
            history.push( { pathname: "/profile-translator-edit", state: "initial" } );
          }
        })
    }).catch((err) => {
        let error = err.response?.data?.errors;
        console.log(err.response)
        let message = "Ha ocurrido un error al crear el usuario.";
        if(JSON.stringify(error)=='{"email":"Correo eléctronico ya está siendo usado"}'){
          message = t('sign-up-client.mail-used')
        }
        setButtonState({ label: t('sign-up-client.create-account'), disabled: false })
        setResponse(
          <Alert variant={'danger'} >
              {message}
          </Alert>
        )
    })
  }


  const ButtonActiveOrInactive = (active, text, action) => {
    return active ? (
      <OptionActive className="button-type" type="button" onClick={action}>
        {text}
      </OptionActive>
    ) : (
      <Option className="button-type" type="button" onClick={action}>
        {text}
      </Option>
    );
  };

  return (
    <Container className="themed-container signup-container" fluid={true}>
      <Row className="no-gutter">
        <Col>
          <Signup className="signup">
            <Logo src="/assets/images/logo.png"></Logo>
            <Title>{t('sign-up-client.sign-up')}</Title>
            <Row>
              <Col>
                {ButtonActiveOrInactive(role === "3" || role=="4", t('sign-up-client.user'), () => {
                  setRole("3");
                })}
              </Col>
              <Col>
                {ButtonActiveOrInactive(role === "2", t('sign-up-client.translator'), () => {
                  setRole("2");
                })}
              </Col>
            </Row>
            <LanguageSelector></LanguageSelector>
            <SignupInfo>
              {t('sign-up-client.already-account')}
              <BackToLoginLink to="/">{t('sign-up-client.log-in')}</BackToLoginLink>
            </SignupInfo>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Label>{t('sign-up-client.name')}</Label>
                <Control
                  type="text"
                  name="firstname"
                  maxlength="100"
                  ref={register({ required: true })}
                />
              </Form.Group>
              {errors.firstname && (
                <div className="alert alert-danger">{t('required-field')}</div>
              )}
              <Form.Group>
                <Label>{t('sign-up-client.last-name')}</Label>
                <Control
                  type="text"
                  name="lastname"
                  maxlength="100"
                  ref={register({ required: true })}
                />
              </Form.Group>
              {errors.lastname && (
                <div className="alert alert-danger">
                  {t('required-field')}
                </div>
              )}
              {role === "3" || role== "4" ?
                <>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Label>{t('sign-up-client.client-type')}</Label>
                    <Form.Control
                      className="form-select"
                      as="select"
                      name="client_type"
                      ref={register({ required: true })}
                      onChange={(e) => {
                        setRole(e.target.value);
                      }}
                    >
                      <option value="3">{t('sign-up-client.natural-person')}</option>
                      <option value="4">{t('sign-up-client.legal-person')}</option>
                    </Form.Control>
                  </Form.Group>
                  {errors.client_type && (
                    <div className="alert alert-danger">
                      {t('required-field')}
                    </div>
                  )}
                  {role === "4" && (
                    <>
                      <Form.Group>
                        <Label>{t('sign-up-client.business-name')}</Label>
                        <Control
                          type="text"
                          name="company_name"
                          ref={register({ required: true })}
                        />
                      </Form.Group>
                      {errors.company_name && (
                        <div className="alert alert-danger">
                          {t('required-field')}
                        </div>
                      )}
                    </>
                  )}
                </>
                : null
              }
              <Form.Group>
                <Label>{t('sign-up-client.email')}</Label>
                <Control
                  type="email"
                  name="email"
                  maxlength="60"
                  ref={register({
                    required: "El correo es requerido",
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: `EL correo debe ser válido`,
                    },
                  })}
                />
              </Form.Group>
              {errors.email && (
                <div className="alert alert-danger">
                  {errors.email.type=="required" ? t('required-field') : null}
                  {errors.email.type=="pattern" ? t('invalid-email') : null}
                </div>
              )}
              <Form.Group>
                <Label>{t('sign-up-client.phone')}</Label>
                <Control
                  type="text"
                  name="phone"
                  maxlength="14"
                  ref={register({
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^[\+\d]?(?:[\d-.\s()]*)$/,
                      message: `El teléfono debe contener solo números o el signo +`,
                    },
                  })}
                />
              </Form.Group>
              {errors.phone && (
                <div className="alert alert-danger">
                  {errors.phone.type=="required" ? t('required-field') : null}
                  {errors.phone.type=="pattern" ? t('invalid-phone') : null}
                </div>
              )}
              <Form.Group>
                <Label>{t('sign-up-client.password')}</Label>
                <InputGroup>
                  <ControlPassword
                    type={showPassword ? "text" : "password"}
                    name="password"
                    ref={register({
                      required: "La contraseña es requerida",
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$¡!%*¿?+\-\\&#"'/&(){}])([A-Za-z\d$@$¡!%*¿?+\-\\&#"'/&(){}]|[^ ]){8,}$/i,
                        message: `La contraseña Debe contener como mínimo una letra mayúscula, una letra minúscula, 1 número, 1 carácter especial y 8 caracteres sin espacio en blanco`,
                      },
                    })}
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
              {errors.password && (
                <div className="alert alert-danger">
                  {errors.password.type=="required" ? t('required-field') : null}
                  {errors.password.type=="pattern" ? t('password-criteria') : null}
                </div>
              )}
              <PasswordInfo>
                {t('sign-up-client.password-criteria')}
              </PasswordInfo>
              <Form.Group controlId="formBasicPassword">
                <Label>{t('sign-up-client.confirm-password')}</Label>
                <InputGroup>
                  <ControlPassword
                    type={showVerifyPassword ? "text" : "password"}
                    name="password_repeat"
                    ref={register({
                      validate: (value) =>
                        value === password.current ||
                        "Las contraseñas no coinciden",
                    })}
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
              {errors.password_repeat && (
                <div className="alert alert-danger">
                  {errors.password_repeat.message}
                </div>
              )}
              <FormCheck>
                <input
                  type="checkbox"
                  name="terms"
                  className="form-check-input"
                  ref={register({ required: true })}
                />
                <FormCheckLabel>
                  {t('sign-up-client.ive-read-the')}
                  <a className="main-link" target="_blank" href={i18n.language=="ES" ? "https://cucu-nativapps-data.s3.amazonaws.com/TyC_ES.pdf" : "https://cucu-nativapps-data.s3.amazonaws.com/TyC_EN.pdf"  } 
                  >{t('sign-up-client.terms-and-conditions')}
                  </a>{" "}
                  {t('sign-up-client.of-the-service-and-the')}{""}
                  <a className="main-link" target="_blank" href={i18n.language=="ES" ? "https://cucu-nativapps-data.s3.amazonaws.com/PTD_ES..pdf" : "https://cucu-nativapps-data.s3.amazonaws.com/PTD_EN..pdf"  } 
                  >{t('sign-up-client.privacy-policy')}
                  </a>
                </FormCheckLabel>
              </FormCheck>
              {errors.terms && (
                <div className="alert alert-danger">
                  {t('sign-up-client.accept-terms')}
                </div>
              )}
              <Submit
                disabled={buttonState.disabled}
                type="submit"
              >
                {buttonState.label}
              </Submit>

              {response}

            </Form>
          </Signup>
        </Col>
        <Col className="bg-image-signup"></Col>
      </Row>
    </Container>
  );
}

export default SignupPage;
