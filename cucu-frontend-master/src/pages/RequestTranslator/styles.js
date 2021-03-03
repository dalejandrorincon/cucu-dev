import { Form, Row, Button, InputGroup } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Title = styled.p`
text-align: center;
margin-top: 20px;
font: normal normal normal 28px Acumin Pro;
letter-spacing: 0px;
color: #ffffff;
opacity: 1;
`;

export const PasswordInfo = styled.p`
text-align: left;
font: normal normal normal 13px/19px Acumin Pro;
letter-spacing: 0px;
color: #a0a0a0;
opacity: 1;
`;

export const WellContainer = styled.div`
background-color: #fff !important;
border-radius: 0 !important;
border: #d1d1d1 solid 1px;
margin-top: 90px;
padding: 30px;
margin-right: 10px;
margin-left: 10px;
margin-bottom: 50px;
`;

export const PasswordRecover = styled.div`
min-height: 100vh;
`;

export const RowRecover = styled(Row)`
background: #f4f4f4;
`;

export const Label = styled(Form.Label)`
font: normal normal bold 15px Acumin Pro;
letter-spacing: 0px;
color: #3c3c3c;
opacity: 1;
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