import styled from 'styled-components';
import { Form } from 'react-bootstrap';

export const SearchContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const SearchStateContainer = styled.div`
  width: 35%;
`;

export const SearchTypeContainer = styled.div`
  width: 25%;
`;

export const CustomSelect = styled(Form.Select)`
  padding-left: 15px;
  border-radius: 50px !important;
  color: #a7a7a7;
  font-style: italic;
`;
