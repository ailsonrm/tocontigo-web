import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import PageAuth from '../pages/auth';
import PageAdmin from '../pages/admin';

const AppRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <PrivateRoute>
          <PageAdmin />
        </PrivateRoute>
      }
    />

    <Route
      path="/acessar"
      element={
        <PublicRoute>
          <PageAuth />
        </PublicRoute>
      }
    />

    <Route
      path="/admin"
      element={
        <PrivateRoute>
          <PageAdmin />
        </PrivateRoute>
      }
    />

    <Route
      path="/manager"
      element={
        <PrivateRoute>
          <PageAdmin />
        </PrivateRoute>
      }
    />

    <Route path="/self_register/:selfid" element={<PageSelfRegister />} />
  </Routes>
);

export default AppRoutes;
