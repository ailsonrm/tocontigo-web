import React, { useEffect } from 'react';
import styled from 'styled-components';
import Box from '../layout/box';

const Content = styled.main`
  display: flex;
  flex-direction: column;
  margin: 12px 0;
  gap: 12px;
`;
const Title = styled.h1`
  font-weight: 700;
  font-size: 26px;
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 765px) {
    flex-direction: column;
  }
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
`;

const Icon = styled.img`
  height: 40px;
  width: 40px;
  border: 1px solid lightgray;
  border-radius: 30px;
  padding: 2px;
`;

const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const Page = ({ children, title, sideAction, icon }) => {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <Box>
      <Header>
        <Div>
          {icon && <Icon src={icon} alt="" />}
          <Title>{title}</Title>
        </Div>
        <Div>{sideAction && sideAction}</Div>
      </Header>
      <Content>{children}</Content>
    </Box>
  );
};

export default Page;
