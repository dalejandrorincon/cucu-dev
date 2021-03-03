import styled from "styled-components";

import { Button } from "react-bootstrap";

export const WellContainerModal = styled.div`
  background-color: #fff !important;
  border-radius: 0 !important;
  border: #d1d1d1 solid 1px;
  padding: 20px;
`;

export const Submit = styled(Button)`
background: #863df9 0% 0% no-repeat padding-box;
border-radius: 3px;
border-color: #863df9;
opacity: 1;
width: 56%;
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
@media screen and (max-width: 768px) {
  width: 54%;
}
`;


export const URLLabel = styled(Button)`
  background: #f9f5ff 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 1;
  border: 0;
  color: #863df9;
  opacity: 1;
  min-height: 40px;
  text-align: center;
  font: normal normal bold 15px Acumin Pro Bold;
  letter-spacing: 0px;
  opacity: 1;
  &:hover {
    background: #f9f5ff 0% 0% no-repeat padding-box;
    border-radius: 3px;
    opacity: 1;
    border: 0;
    color: #863df9;
  }
  :not(:disabled):not(.disabled).active,
  :not(:disabled):not(.disabled):active,
  .show > .dropdown-toggle {
    background: #f9f5ff 0% 0% no-repeat padding-box;
    border-radius: 3px;
    opacity: 1;
    border: 0;
    color: #863df9;
  }
  &:focus {
    background: #f9f5ff 0% 0% no-repeat padding-box;
    border-radius: 3px;
    opacity: 1;
    border: 0;
    color: #863df9;
    box-shadow: none;
  }
`;


export const Cancel = styled(Button)`
  background: transparent;
  border-radius: 3px;
  opacity: 1;
  width: 40%;
  min-height: 50px;
  margin-bottom: 20px;
  text-align: center;
  font: normal normal medium 17px Acumin Pro;
  letter-spacing: 0px;
  color: #000;
  opacity: 1;
  border: 0px;
  &:hover {
    color: #000;
    background-color: transparent;
    border-color: #863df9;
  }
  :not(:disabled):not(.disabled).active,
  :not(:disabled):not(.disabled):active,
  .show > .dropdown-toggle {
    background-color: #863df9;
    border-color: #863df9;
  }
  &:focus, &:active {
    color: #000;
    border-color: #863df9;
    box-shadow: none;
    background-color: transparent;
}
`;