import React, { useContext, useEffect, useState } from 'react';
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

const Banner = styled.div`
  background-color: #f8c105;
  color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  text-align: center;
  font-family: Arial, sans-serif;
  font-size: 24px;
  position: relative;
  margin-bottom: 10px;

  .banner-header {
    width: 20%;
    background-color: #25b54d;
    color: white;
    padding: 10px;
    font-size: 28px;
    font-weight: 900;
    position: absolute;
    top: 35px;
    left: 10%;
    transform: translateX(-50%) rotate(-24deg);
    transform-origin: bottom center;
    padding: 10px;
    border-radius: 5px;

    @media (max-width: 550px) {
      width: 150px;
      top: 15px;
      left: 20%;
    }
  }

  .time {
    margin: 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @media (max-width: 550px) {
      margin: 35px 0 0 10px;
    }
  }

  .time span {
    font-size: 50px;
    font-weight: 900;
    -webkit-text-stroke: 2px #25b54d;
  }

  .time div span {
    font-size: 15px;
    font-weight: 600;
    -webkit-text-stroke: 0 !important;
  }

  .description {
    font-size: 12px;
    font-weight: bold;
    font-family: 'Nunito';
    margin-top: 10px;
    color: #0d77b1;
  }
`;

const Header = () => {
  const { currentUser, handleLogout } = useContext(ContextUser);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2024-10-06T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  if (currentUser === null) {
    return <>carregando</>;
  }

  return (
    <Box>
      <Banner>
        <div className="banner-header">FALTAM</div>
        <div className="time" id="countdown">
          <span id="days">{timeRemaining.days} DIAS</span>
          <div
            style={{
              width: 'max-content',
              display: 'flex',
              gap: '10px'
            }}
          >
            <span id="hours">{timeRemaining.hours} HORAS</span>
            <span id="minutes">{timeRemaining.minutes} MINUTOS</span>
            <span id="seconds">{timeRemaining.seconds} SEGUNDOS</span>
          </div>
        </div>
        <div className="description">
          Eleições Municipais 2024 - 1º Turno (06/10/2024)
        </div>
      </Banner>
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
