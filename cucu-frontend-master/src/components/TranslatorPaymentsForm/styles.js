import { Form, Row, Button, InputGroup } from "react-bootstrap";
import styled from "styled-components";

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
margin-bottom: 30px;
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

export const Title = styled.p`
margin-top: 30px;
font: normal normal bold 28px Acumin Pro;
letter-spacing: 0px;
color: #3c3c3c;
opacity: 1;
`;
