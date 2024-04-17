import React from 'react';
import styled, { css } from 'styled-components';
import Button from 'react-bootstrap/Button';
import { TbLogin2 } from 'react-icons/tb';

const CustomButton = styled(Button)`
  ${props => {
    if (props.$fullwidth) {
      return css`
        width: 100%;
      `;
    }
    return '';
  }}
`;

function SubmitButton({
  children,
  loading = false,
  block = false,
  type = 'submit',
  waitingMessage = 'carregando',
  fullwidth = false,
  callFunc = null
}) {
  return (
    <CustomButton
      disabled={loading}
      block={block.toString()}
      onClick={callFunc}
      type={type}
      $fullwidth={fullwidth}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        justifyContent: 'center',
      }}
    >
      {!loading ? (
        <>
          {children}
        </>
      ) : (
        <>{waitingMessage}...</>
      )}
      {!loading && <TbLogin2 style={{ fontSize: '24px' }} />}
    </CustomButton>
  );
}

export default SubmitButton;
