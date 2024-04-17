import React from 'react';
import styled from 'styled-components';

const Element = styled.div`
  font-size: 15px;
  color: #718a9f;
  font-weight: bold;
`;

const Subtitle = ({ label }) => (
  <Element>{label}</Element>
);

export default Subtitle;
