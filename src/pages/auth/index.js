import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Login from './login';
import logo from '../../assets/logo-falacmgdireito.png';

const Element = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;

  img {
    max-width: 400px;
  }
`;

const PageAuth = () => {
  const [action, setAction] = useState('login');
  const [params] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);

  const handleAction = param => {
    setAction(param);
  };

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
