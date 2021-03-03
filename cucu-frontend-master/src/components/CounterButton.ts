import styled from "styled-components";
import { logout } from "../utils/session";

export const CounterButton = styled.button`
  display: inline-block;
  background-color: #3f51b5;
  color: #ffffff;
  font-size: 24px;
  border: none;
  border-radius: 4px;
  margin: 12px;
  cursor: pointer;
  &:hover {
    background-color: #334296;
  }
`;
