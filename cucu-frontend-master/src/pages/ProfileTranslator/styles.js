import { Row, Button } from "react-bootstrap";
import styled from "styled-components";

export const Title = styled.p`
margin-top: 30px;
font: normal normal bold 28px Acumin Pro;
letter-spacing: 0px;
color: #3c3c3c;
opacity: 1;
`;

export const WellContainer = styled.div`
background-color: #fff !important;
border-radius: 0 !important;
border: #d1d1d1 solid 1px;
padding-top: 30px;
margin-bottom: 30px;
margin-right: 10px;
margin-left: 10px;
@media screen and (max-width: 768px) {
  margin: 0px
}
`;

export const PasswordRecover = styled.div`
min-height: 100vh;
`;

export const RowRecover = styled(Row)`
background: #f4f4f4;
`;


export const Submit = styled(Button)`
background: #863df9 0% 0% no-repeat padding-box;
border-radius: 3px;
border-color: #863df9;
opacity: 1;
width: 100%;
min-height: 50px;
margin-bottom: 20px;
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
