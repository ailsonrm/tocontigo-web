import React from 'react';
import styled from 'styled-components';
import { ImSpinner4 } from 'react-icons/im';

const Element = styled.div`
  display: block;
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  color: #999;

  i {
    font-size: 40px;
  }

  span {
    font-size: 22px;
    margin-top: 20px;
  }
`;

const LoadingPage = ({ label }) => (
  <Element>
    <i><ImSpinner4 style={{animation: "spin 2s infinite linear"}}/></i>
    {label && <span>{label}...</span>}
  </Element>
);

export default LoadingPage;
