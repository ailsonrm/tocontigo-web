import styled from 'styled-components';
import { Form } from 'react-bootstrap';

export const CustomChartsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const CustomCounter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
