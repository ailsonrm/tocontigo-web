import React from 'react';
import styled from 'styled-components';
import Box from '../box';

const Element = styled.footer`
  display: flex;
  align-items: end;
  justify-content: space-between;
  width: 100%;

  &:hover {
    img {
      filter: grayscale(0%);
      -webkit-filter: grayscale(0%);
      opacity: 1;
    }
  }

  img {
    height: 30px;
    opacity: 0.6;
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
    transition: all linear 200ms;
  }
`;

const Footer = () => (
  <Box
    style={{
      position: 'absolute',
      bottom: 0,
      display: 'block',
      width: 'calc(100% - 20px)',
      margin: '10px'
    }}
  >
    <Element>
      <span>Todos os direitos reservados. </span>
    </Element>
  </Box>
);

export default Footer;
