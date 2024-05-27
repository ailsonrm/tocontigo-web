import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import PublicRoute from './public-route';
import PageAuth from '../pages/auth';
import PageAdmin from '../pages/admin';
import PagePillar from '../pages/pillar';
import PageLeader from '../pages/leader';
import PageSelfRegister from '../pages/selft-register';

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
      path="/pillar"
      element={
        <PrivateRoute>
          <PagePillar />
        </PrivateRoute>
      }
    />

    <Route
      path="/leader"
      element={
        <PrivateRoute>
          <PageLeader />
        </PrivateRoute>
      }
    />

    <Route path="/self_register/:selfid" element={<PageSelfRegister />} />
  </Routes>
);

export default AppRoutes;
