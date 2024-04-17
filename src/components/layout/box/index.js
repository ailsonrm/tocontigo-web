import React from 'react';
import styled from 'styled-components';

const Element = styled.div`
  background: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: -8px 12px 15px -10px rgba(25, 42, 70, 0.08);

  @media (max-width: 550px) {
    min-width: 350px;
  }
`;

const Box = ({ children, style }) => (
  <Element style={style}>{children}</Element>
);

Box.defaultProps = {
  style: undefined
};

export default Box;
