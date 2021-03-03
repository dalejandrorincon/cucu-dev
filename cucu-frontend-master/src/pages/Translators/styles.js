import { Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { Link } from "react-router-dom";

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
  @media screen and (max-width: 768px) {
    padding-top: 10px;
  }
`;

export const PasswordRecover = styled.div`
  min-height: 100vh;
  padding-bottom: 30px;
`;

export const RowRecover = styled(Row)`
  background: #f4f4f4;
`;

export const LabelFilter = styled(Row)`
  padding-left: 10px;
  padding-right: 10px;
`;

export const ColFilter = styled(Col)`
  text-align: end;
`;

export const ResendLink = styled(Link)`
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

export const TextFilter = styled.p`
  font: normal normal normal 15px Acumin Pro;
  letter-spacing: 0px;
  color: #a0a0a0;
  opacity: 1;
`;

export const TextFilterBox = styled.p`
  background: #e9e9e9 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 1;
  height: 30px;
  padding: 10px;
  width: 100px;
  margin-top: 0px;
  font: normal normal normal 15px Acumin Pro;
  -webkit-letter-spacing: 0px;
  -moz-letter-spacing: 0px;
  -ms-letter-spacing: 0px;
  letter-spacing: 0px;
  opacity: 1;
  text-align: center;
`;

export const TextFilterBoxEnd = styled.p`
  background: #e9e9e9 0% 0% no-repeat padding-box;
  border-radius: 3px;
  opacity: 1;
  height: 30px;
  padding: 10px;
  width: 100px;
  margin-top: 0px;
  font: normal normal normal 15px Acumin Pro;
  -webkit-letter-spacing: 0px;
  -moz-letter-spacing: 0px;
  -ms-letter-spacing: 0px;
  letter-spacing: 0px;
  opacity: 1;
  text-align: center;
  float: right;
`;