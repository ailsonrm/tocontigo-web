import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  to {
    background-position-x: -20%;
  }
`;

const Element = styled.div`
  border-radius: 10px;
  min-height: 100px;
  background-color: #ededed;
  height: ${props => props.height};
  width: ${props => props.width};

  background: linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    #ededed;

  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1s ${gradientAnimation} ease-in-out infinite;
`;

const SkeletonLoading = ({ width, height }) => (
  <Element width={width} height={height} />
);

export default SkeletonLoading;
