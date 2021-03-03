import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";
import styled from "styled-components";
import { logout } from "../../utils/session";
import { Link, useHistory, useParams } from "react-router-dom";

import {
  Logo,
  Title,
  RecoverInfo,
  PasswordInfo,
  WellContainer,
  PasswordRecover,
  RowRecover,
  Successful,
  SuccessfulContainer,
  SuccessfulInfo,
  Label,
  Submit,
  ControlPassword,
  ShowPassword
} from "./styles"

import * as AuthAPI from '../../api/auth';
import { useTranslation } from 'react-i18next';

const baseUri = process.env.REACT_APP_API_URL;

function RecoverPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [successfulSend, setSuccessfulSend] = useState(false);
  const [successfulCheck, setSuccessfulCheck] = useState(false);  
  const history = useHistory();
  let { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState(false)
  const { t, i18n } = useTranslation();

  useEffect(() => {
		checkToken()
  }, []);
  
  const checkToken = () => {

    AuthAPI.checkToken({token: token}).then((res)=>{
      setSuccessfulCheck(true)
    }).catch((err) => {
      setResponse(
        <Alert variant={'danger'} >
          {t('forgot-password.token-expired')} 
        </Alert>
      )
    })
  }

  const submitForm = () => {
    const body = new URLSearchParams({
      password,
      token,
    });

    try {
      if (password !== "" && confirmPassword !== "") {
        if (
          password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&+\-\\])([A-Za-z\d$@$!%*?&+\-\\]|[^ ]){8,}$/i)
        ) {
          console.log("valid password");
        } else {
          setResponse(
            <Alert variant={'danger'} >
              {t('forgot-password.password-criteria')} 
            </Alert>
          )
          setError(true)
          return;
        }

        if (password !== confirmPassword) {
          setResponse(
            <Alert variant={'danger'} >
              {t('forgot-password.passwords-different')} 
            </Alert>
          )
          setError(true)
          return;
        }

        fetch(`${baseUri}/auth/change-password`, {
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
            setSuccessfulSend(true);
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setResponse(
          <Alert variant={'danger'} >
            {t('forgot-password.all-fields')} 
          </Alert>
        )
        setError(true)
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Container className="themed-container recover-container" fluid={true}>
      <RowRecover>
        <Col className="col-md-5 mx-auto">
          <PasswordRecover>
            <Logo src="/assets/images/logo.png"></Logo>
            <WellContainer>
              {successfulCheck ? (

              <>{successfulSend ? (
                <>
                  {" "}
                  <SuccessfulContainer>
                    <Successful src="/assets/images/check@2x.png"></Successful>
                  </SuccessfulContainer>
                  <Title>
                    {t('forgot-password.password-created')} 
                  </Title>
                  <SuccessfulInfo>
                    {t('forgot-password.create-success')} 
                  </SuccessfulInfo>
                  <Submit
                    type="button"
                    onClick={() => {
                      history.push("/");
                    }}
                  >
                    {t('forgot-password.log-in')} 
                  </Submit>
                </>
              ) : (
                <>
                  <Title>{t('forgot-password.create-password')}</Title>
                  <RecoverInfo>
                    {t('forgot-password.create-label')}
                  </RecoverInfo>
                  <Form>
                    <Form.Group controlId="formBasicPassword">
                      <Label>{t('forgot-password.password')}</Label>
                      <InputGroup>
                        <ControlPassword
                          type={showPassword ? "text" : "password"}
                          onChange={(e: any) => setPassword(e.target.value)}
                          className={error ? "input-danger" : ""}
                        />
                        <InputGroup.Prepend>
                          <ShowPassword
                            onClick={() => {
                              setShowPassword(!showPassword);
                            }}
                            className={error ? "input-danger" : ""}
                          >
                            {showPassword ? t('hide') : t('show')}
                          </ShowPassword>
                        </InputGroup.Prepend>
                      </InputGroup>
                    </Form.Group>
                    <PasswordInfo>
                      {t('forgot-password.password-criteria')}
                    </PasswordInfo>
                    <Form.Group controlId="formBasicPassword">
                      <Label>{t('forgot-password.confirm-password')}</Label>
                      <InputGroup>
                        <ControlPassword
                          type={showVerifyPassword ? "text" : "password"}
                          onChange={(e: any) =>
                            setConfirmPassword(e.target.value)
                          }
                          className={error ? "input-danger" : ""}
                        />
                        <InputGroup.Prepend>
                          <ShowPassword
                            onClick={() => {
                              setShowVerifyPassword(!showVerifyPassword);
                            }}
                            className={error ? "input-danger" : ""}
                          >
                            {showVerifyPassword ? t('hide') : t('show')}
                          </ShowPassword>
                        </InputGroup.Prepend>
                      </InputGroup>
                    </Form.Group>
                    <Submit
                      type="button"
                      onClick={() => {
                        submitForm();
                      }}
                    >
                      {t('forgot-password.create-password')}
                    </Submit>
                  </Form>
                </>
              )}</>
              ):null}
              {response}
            </WellContainer>
          </PasswordRecover>
        </Col>
      </RowRecover>
    </Container>
  );
}

export default RecoverPasswordPage;
