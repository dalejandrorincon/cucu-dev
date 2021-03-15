import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Logo,
  Title,
  LoginInfo,
  CreateAccountLink,
  ForgotPasswordLink,
  Label,
  Control,
  ControlPassword,
  Submit,
  Check,
  Login,
  ShowPassword
} from './styles'
import { useTranslation } from 'react-i18next';

import { connectSocket } from "../../utils/constants"

import LanguageSelector from "../../components/LanguageSelector";

const baseUri = process.env.REACT_APP_API_URL;


function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const { t, i18n } = useTranslation();


  const onSubmit = (data: any) => {
    data.email = data.email?.toLowerCase()
    const body = new URLSearchParams(data);

    try {
      fetch(`${baseUri}/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: body,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.message === "Login Successful") {
            localStorage.setItem("token", responseJson.token);
            localStorage.setItem("userId", responseJson.user.id);
            localStorage.setItem("role", responseJson.user.role);
            localStorage.setItem(
              "userName",
              responseJson.user.firstname + " " + responseJson.user.lastname
            );
            localStorage.setItem("image_url", responseJson.user.image_url)
            connectSocket()
            if (responseJson.user.role == 3 || responseJson.user.role == 4) {
              history.push("/translators");
            } else {
              history.push("/services");
            }
          } else {
            setResponse(
              <Alert variant={'danger'} >
                  {responseJson.message}
              </Alert>
            )
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Container className="themed-container login-container" fluid={true}>
      <Row className="no-gutter">
        <Col>
          <Login className="login">
            <Logo src="/assets/images/logo.png"></Logo>
            <Title>{t('login.login')}</Title>
            <LanguageSelector></LanguageSelector>
            <LoginInfo>
              {t('login.dont-account')}
              <CreateAccountLink to="/signup">
                {t('login.sign-up')}
              </CreateAccountLink>
            </LoginInfo>            
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group>
                <Label>{t('login.email')}</Label>
                <Control
                  type="email"
                  name="email"
                  ref={register({ required: true })}
                />
              </Form.Group>
              {errors.email && (
                <div className="alert alert-danger">
                  {t('required-field')}
                </div>
              )}
              <Form.Group controlId="formBasicPassword">
                <Label>{t('login.password')}</Label>
                <InputGroup>
                  <ControlPassword
                    type={showPassword ? "text" : "password"}
                    name="password"
                    ref={register({ required: true })}
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
                  {t('required-field')}
                </div>
              )}
              <ForgotPasswordLink to="/forgot-password">
                {t('login.forgot-password')}
              </ForgotPasswordLink>
              <Form.Group controlId="formBasicCheckbox">
                <Check type="checkbox" label={t('login.remember-me')} />
              </Form.Group>
              <Submit type="submit">{t('login.login')}</Submit>
              {response}
            </Form>
          </Login>
        </Col>
        <Col className="bg-image"></Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
