import React, { useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import Login from './login';
import logo from '../../assets/logo-tocontigo.png';
import screen from '../../assets/screen.png';

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
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {!isMobile && (
        <div
          style={{
            background: '#4B6CDD',
            width: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px'
          }}
        >
          <img src={screen} alt="" style={{ width: '380px' }} />
          <h1 style={{ color: 'white', fontSize: '20px' }}>
            Bem-vindos ao TôContigo!
          </h1>
          <div
            style={{
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '80%'
            }}
          >
            <p>
              Nosso sistema simplifica a gestão de apoiadores com eficiência.
              Com ferramentas avançadas, organizamos informações de contato,
              rastreamos o engajamento e analisamos o desempenho das interações
              para otimizar estratégias. A segmentação de apoiadores é
              facilitada, garantindo a precisão das ações. Potencialize suas
              campanhas com nossa solução especializada e intuitiva.
            </p>
          </div>
        </div>
      )}

      <Element
        style={{
          width: isMobile ? '100%' : '50%'
        }}
      >
        <a>
          <img className="logo" src={logo} alt="" />
        </a>
        {render()}
      </Element>
    </div>
  );
};

export default PageAuth;
