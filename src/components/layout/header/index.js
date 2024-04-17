import React, { useContext } from 'react';
import styled from 'styled-components';
import { ContextUser } from '../../../providers/ContextUser';
import Box from '../box';
import { TbLogout } from 'react-icons/tb';
import { Button } from 'react-bootstrap';

const Element = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 5px;

  @media (max-width: 550px) {
    flex-direction: row;
  }

  h4 {
    font-size: 22px;
    font-weight: 600;
  }

  span {
    display: block;
    margin-bottom: 0px;
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 100%;
  }
`;

const Header = () => {
  const { currentUser, handleLogout } = useContext(ContextUser);

  if (currentUser === null) {
    return <>carregando</>;
  }

  return (
    <Box>
      <Element>
        <div
          id="top-bar"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '5px'
          }}
        >
          <div
            id="logo"
            style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}
          >
            <h4>{currentUser?.name}</h4>
            <span>{currentUser?.email}</span>
          </div>
          <div
            id="role"
            style={{
              color: '#49a9ff',
              border: '1px solid #49a9ff',
              padding: '0 5px',
              borderRadius: '10px',
              fontSize: '12px'
            }}
          >
            {currentUser?.role?.name.toLowerCase()}
          </div>
        </div>

        <Button
          onClick={handleLogout}
          variant="outline-danger"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <>
            Sair
            <TbLogout
              style={{
                fontSize: 24,
                marginRight: 10
              }}
            />
          </>
        </Button>
      </Element>
    </Box>
  );
};

export default Header;
