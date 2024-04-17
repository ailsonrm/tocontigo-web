import styled from 'styled-components';
import { BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { InputGroup, Form, ListGroup } from 'react-bootstrap';

export const AuthTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const AuthSubTitle = styled.div`
  margin-bottom: 20px;
  text-align: justify;
  text-align: -moz-center;
  text-align: -webkit-center;
  text-align: center;
`;

export const AuthTitleContainer = styled.div`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
`;

export const CustomInputGroup = styled(InputGroup)`
  justify-content: center;
  align-items: center;
`;

export const CustomFormControl = styled(Form.Control)`
  margin-right: -41px;
  border-radius: 0.375rem !important;
  background-image: none !important;

  &::placeholder {
    font-style: italic;
    font-size: 13px;
    color: #888888;
  }
`;

export const CustomInputGroupText = styled(InputGroup.Text)`
  height: 35px;
  color: #888888;
  z-index: 99;
  background: none;
  border: none;
  margin-left: -3px;
  cursor: pointer;
`;

export const BsXCircleRed = styled(BsXCircle)`
  font-size: 14px;
  stroke-width: 0.04125em;
  color: #ff5555;
`;

export const BsCheckCircleGreen = styled(BsCheckCircle)`
  font-size: 14px;
  stroke-width: 0.04125em;
  color: #00d38c;
`;

export const PasswordErrosDesc = styled.div`
  margin-left: 5px;
  color: #888888;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
`;

export const CustomListGroupItem = styled(ListGroup.Item)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: none;
  padding-top: 5px;
  padding-bottom: 5px;
`;

export const CustomFormControlFeedback = styled(Form.Control.Feedback)`
  font-size: 12px;
  margin-left: 15px;
`;
