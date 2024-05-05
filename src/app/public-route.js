import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ContextUser } from '../providers/ContextUser';
import LoadingPage from '../components/loading-page';
import Layout from '../components/layout';
import PageUnauthorized from '../pages/unauthorized';

const PublicRoute = ({ children }) => {
  const { signedIn, getRedirectUrl, currentUser } = useContext(ContextUser);
  const token = localStorage.getItem('JWT');  

  if (token) {
    const urlGoTo = getRedirectUrl(currentUser?.role);
    return <Navigate to={urlGoTo} replace />;
  }
  return children;
};
export default PublicRoute;
