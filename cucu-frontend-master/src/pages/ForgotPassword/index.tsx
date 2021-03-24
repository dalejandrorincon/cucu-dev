import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import {
  Logo,
  Successful,
  SuccessfulContainer,
  Title,
  SuccessfulInfo,
  SuccessfulInfoLabel,
  ForgotPasswordInfo,
  BackToLogin,
  Label,
  Control,
  Submit,
  ButtonToLogin,
  ForgotPassword,
  ForgotPasswordSuccessful,
  ResendInfo,
  ResendLink,
} from "./styles"
import { useTranslation } from 'react-i18next';
import { getLang } from '../../utils/constants';

const baseUri = process.env.REACT_APP_API_URL;

function ForgotPasswordPage() {
  const [successfulSendCode, setSuccessfulSendCode] = useState(false);
  const history = useHistory();

  const [email, setEmail] = useState("");
  const { t, i18n } = useTranslation();
  const [error, setError] = useState(false)

  const submitForm = () => {
    const body = new URLSearchParams({
      email: email.toLowerCase(),
      lang: getLang()
    });

    try {
      if (email !== "") {
        fetch(`${baseUri}/auth/password-recovery`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: body,
        })
          .then((response) => response.json())
          .then((responseJson) => {
            //alert(responseJson.message);
            setSuccessfulSendCode(true);
            setEmail("");
          })
          .catch((error) => {
            //console.log(error);
          });
      } else {
        setError(true)
        //alert("Ingresa por favor tu correo electrónico");
      }
    } catch (error) {
      //console.log("Error", error);
    }
  };

  return (
    <Container className="themed-container recover-container" fluid={true}>
      <Row className="no-gutter">
        <Col>
          {successfulSendCode ? (
            <ForgotPasswordSuccessful className="recover">
              <Logo src="/assets/images/logo.png"></Logo>
              <SuccessfulContainer>
                <Successful src="/assets/images/check@2x.png"></Successful>
              </SuccessfulContainer>
              <Title>{t('confirm-forgot-password.email-sent')}</Title>
              <SuccessfulInfo>
                {t('confirm-forgot-password.detail1')}
              </SuccessfulInfo>
              <SuccessfulInfoLabel>
                {t('confirm-forgot-password.detail2')}
              </SuccessfulInfoLabel>
              <ButtonToLogin>
                <Submit
                  type="button"
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  {t('confirm-forgot-password.login')}
                </Submit>
                <ResendInfo>
                  {t('confirm-forgot-password.dont-get-email')}
                  <ResendLink
                    to="#"
                    onClick={() => {
                      setSuccessfulSendCode(false);
                    }}
                  >
                    {t('confirm-forgot-password.resend')}
                  </ResendLink>
                </ResendInfo>
              </ButtonToLogin>
            </ForgotPasswordSuccessful>
          ) : (
            <ForgotPassword className="recover">
              <Logo src="/assets/images/logo.png"></Logo>
              <Title>{t('forgot-password.reset-password')}</Title>
              <ForgotPasswordInfo>
              {t('forgot-password.details')}
              </ForgotPasswordInfo>
              <Form>
                <Form.Group>
                  <Label>
                    {t('forgot-password.email')}
                  </Label>
                  <Control
                    type="email"
                    onChange={(e: any) => setEmail(e.target.value)}
                  />
                  {error && (
                    <div className="alert alert-danger">
                      {t('required-field')}
                    </div>
                  )}
                </Form.Group>
                <Submit type="button" onClick={submitForm}>
                  {t('forgot-password.send-email')}
                </Submit>
              </Form>
              <BackToLogin to="/">{t('forgot-password.go-back')}</BackToLogin>
            </ForgotPassword>
          )}
        </Col>
        <Col className="bg-image"></Col>
      </Row>
    </Container>
  );
}

export default ForgotPasswordPage;
