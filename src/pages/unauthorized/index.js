import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ContextUser } from '../../providers/ContextUser';

const Page = styled.section`
  text-align: center;
  padding: 50px 0;

  code {
    font-size: 80px;
    color: #004d8d;
    font-weight: bold;
  }
  div {
    font-size: 30px;
    font-weight: bold;
    margin: 30px 0 15px;
  }
  p {
    margin-bottom: 30px;
  }
`;

const PageUnauthorized = () => {
  const { getRedirectUrl, currentUser } = useContext(ContextUser);
  const navigate = useNavigate();

  return (
    <Page>
      <code>401</code>
      <div>Sem permissão</div>
      <p>Você não tem permissão para acessar esta página.</p>
      <Button
        onClick={() => {
          navigate(getRedirectUrl(currentUser?.role, currentUser?.allowedId));
        }}
      >
        Volta ao início
      </Button>
    </Page>
  );
};

export default PageUnauthorized;
