import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Login from './login';
import logo from '../../assets/logo-tocontigo.png';

const Element = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;

  img {
    max-width: 250px;
    margin-bottom: 30px;
    margin-top: 30px;
  }
`;

const PageAuth = () => {
  const [action, setAction] = useState('login');
  const [params] = useSearchParams();

  const handleAction = param => {
    setAction(param);
  };

  const render = () => {
    return <Login handleAction={handleAction} />;
  };

  return (
    <Element>
      <a>
        <img className="logo" src={logo} alt="" />
      </a>
      {render()}
    </Element>
  );
};

export default PageAuth;
