import styled from "styled-components";

import {
    Row,
    Form,
    Button,
    InputGroup,
} from "react-bootstrap";

import { Link } from "react-router-dom";



export const Title = styled.p`
  margin-top: 30px;
  font: normal normal bold 28px Acumin Pro;
  letter-spacing: 0px;
  color: #3c3c3c;
  opacity: 1;
`;

export const SubmitCancel = styled(Button)`
  background: #ffffff 0% 0% no-repeat padding-box;
  border: 1px solid #d5d5d5;
  border-radius: 3px;
  opacity: 1;
  color: #d03b3b;
  opacity: 1;
  width: 100%;
  min-height: 50px;
  margin-top: 20px;
  text-align: center;
  font: normal normal medium 17px Acumin Pro;
  letter-spacing: 0px;
  opacity: 1;
  &:hover {
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
    opacity: 1;
    color: #d03b3b;
  }
  :not(:disabled):not(.disabled).active,
  :not(:disabled):not(.disabled):active,
  .show > .dropdown-toggle {
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
    opacity: 1;
    color: #d03b3b;
  }
  &:focus {
    background: #ffffff 0% 0% no-repeat padding-box;
    border: 1px solid #d5d5d5;
    border-radius: 3px;
    opacity: 1;
    color: #d03b3b;
    box-shadow: none;
  }
`;

export const WellContainer = styled.div`
  background-color: #fff !important;
  border-radius: 0 !important;
  border: #d1d1d1 solid 1px;
  padding-top: 30px;
  margin-bottom: 30px;
`;

export const WellContainerModal = styled.div`
  background-color: #fff !important;
  border-radius: 0 !important;
  border: #d1d1d1 solid 1px;
  padding: 20px;
`;

export const PasswordRecover = styled.div`
  min-height: 100vh;
`;

export const RowRecover = styled(Row)`
  background: #f4f4f4;
`;

export const Submit = styled(Button)`
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