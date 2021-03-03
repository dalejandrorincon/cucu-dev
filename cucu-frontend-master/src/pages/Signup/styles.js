import { Form, Row, Button, InputGroup } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Logo = styled.img`
left: calc(50% - 41px);
position: relative;
width: 82px;
margin-top: 30px;
height: 35px;
`;

export const Title = styled.p`
text-align: center;
font: normal normal bold 28px Acumin Pro;
letter-spacing: 0px;
color: #3c3c3c;
opacity: 1;
padding-top: 30px;
`;

export const SignupInfo = styled.p`
margin-top: 30px;
text-align: left;
font: normal normal normal 15px Acumin Pro;
letter-spacing: 0px;
color: #2d2d2d;
`;

export const BackToLoginLink = styled(Link)`
text-align: left;
text-decoration: underline;
font: normal normal normal 15px Acumin Pro;
letter-spacing: 0px;
color: #863df9;
margin-left: 5px;
&:hover {
  color: #863df9;
  text-decoration: underline;
}
`;

export const ForgotPasswordLink = styled(Link)`
text-align: left;
text-decoration: underline;
font: normal normal normal 13px Acumin Pro;
letter-spacing: 0px;
color: #2d2d2d;
opacity: 1;
&:hover {
  color: #2d2d2d;
  text-decoration: underline;
}
`;

export const Label = styled(Form.Label)`
font: normal normal bold 15px Acumin Pro;
letter-spacing: 0px;
color: #3c3c3c;
opacity: 1;
`;

export const Control = styled(Form.Control)`
background: #ffffff 0% 0% no-repeat padding-box;
border: 1px solid #d5d5d5;
border-radius: 3px;
opacity: 1;
min-height: 45px;
&:focus {
  color: #495057;
  background-color: #fff;
  border-color: #d5d5d5;
  outline: 0;
  box-shadow: none;
}
`;

export const ControlPassword = styled(Form.Control)`
background: #ffffff 0% 0% no-repeat padding-box;
border: 1px solid #d5d5d5;
border-radius: 3px;
border-right: 0px;
opacity: 1;
min-height: 45px;
&:focus {
  color: #495057;
  background-color: #fff;
  border-color: #d5d5d5;
  outline: 0;
  box-shadow: none;
}
`;

export const OptionActive = styled(Button)`
opacity: 1;
width: 100%;
min-height: 50px;
text-align: center;
font: normal normal medium 17px Acumin Pro;
letter-spacing: 0px;
background: #f9f5ff 0% 0% no-repeat padding-box;
border: 1px solid #863df9;
border-radius: 3px;
opacity: 1;
text-align: center;
color: #863df9;
&:hover {
  color: #863df9;
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-color: #863df9;
}
:not(:disabled):not(.disabled).active,
:not(:disabled):not(.disabled):active,
.show > .dropdown-toggle {
  color: #863df9;
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-color: #863df9;
}
.show > .dropdown-toggle {
  color: #863df9;
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-color: #863df9;
}
&:focus {
  color: #863df9;
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-color: #863df9;
  box-shadow: none;
}
margin-top: 30px;
`;

export const Option = styled(Button)`
opacity: 1;
width: 100%;
min-height: 50px;
text-align: center;
font: normal normal medium 17px Acumin Pro;
letter-spacing: 0px;
background: #ffffff 0% 0% no-repeat padding-box;
border: 1px solid #d5d5d5;
border-radius: 3px;
opacity: 1;
text-align: center;
color: #2d2d2d;
opacity: 1;
&:hover {
  color: #2d2d2d;
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-color: #863df9;
}
:not(:disabled):not(.disabled).active,
:not(:disabled):not(.disabled):active,
.show > .dropdown-toggle {
  color: #2d2d2d;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d5d5d5;
}
.show > .dropdown-toggle {
  color: #2d2d2d;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d5d5d5;
}
&:focus {
  color: #2d2d2d;
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d5d5d5;
  box-shadow: none;
}
margin-top: 30px;
`;

export const Submit = styled(Button)`
background: #863df9 0% 0% no-repeat padding-box;
border-radius: 3px;
border-color: #863df9;
opacity: 1;
width: 100%;
min-height: 50px;
text-align: center;
font: normal normal medium 17px Acumin Pro;
letter-spacing: 0px;
color: #ffffff;
opacity: 1;
&:hover {
  color: #fff;
  background-color: #863df9;
  border-color: #863df9;
}
:not(:disabled):not(.disabled).active,
:not(:disabled):not(.disabled):active,
.show > .dropdown-toggle {
  color: #fff;
  background-color: #863df9;
  border-color: #863df9;
}
&:focus {
  color: #fff;
  background-color: #863df9;
  border-color: #863df9;
  box-shadow: none;
}
margin-top: 30px;
`;

export const Signup = styled.div`
min-height: 100vh;
padding-left: 15%;
padding-right: 5%;
padding-bottom: 30px;
`;

export const ShowPassword = styled(InputGroup.Text)`
font: normal normal normal 13px Acumin Pro;
letter-spacing: 0px;
color: #2d2d2d;
opacity: 1;
border-left: 0;
background: transparent;
border-radius: 3px;
cursor: pointer;
`;

export const PasswordInfo = styled.p`
text-align: left;
font: normal normal normal 13px/19px Acumin Pro;
letter-spacing: 0px;
color: #a0a0a0;
opacity: 1;
`;

export const FormCheck = styled.div`
position: relative;
display: block;
padding-left: 1.25rem;
`;

export const FormCheckLabel = styled.div`
margin-bottom: 0;
text-align: left;
font: normal normal normal 15px/21px Acumin Pro;
letter-spacing: 0px;
color: #2d2d2d;
`;
