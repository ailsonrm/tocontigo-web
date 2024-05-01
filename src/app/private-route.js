import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ContextUser } from '../providers/ContextUser';
import LoadingPage from '../components/loading-page';
import Layout from '../components/layout';
import PageUnauthorized from '../pages/unauthorized';

const PrivateRoute = ({ children }) => {
  const { isLoading, signedIn, currentUser, getRedirectUrl } =
    useContext(ContextUser);
  const currentLocation = useLocation().pathname;
  
  if (isLoading) {
    return <LoadingPage label="Carregando" />;
  }

  if (!signedIn) {
    return <Navigate to="/acessar" replace />;
  }

  return <Layout>{children}</Layout>;
};
export default PrivateRoute;
