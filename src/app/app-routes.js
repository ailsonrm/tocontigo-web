import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './private-route';
import PageAuth from '../pages/auth';
import PageAdmin from '../pages/admin';
import PagePillar from '../pages/pillar';
import PageLeader from '../pages/leader';

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

    <Route path="/acessar" element={<PageAuth />} />

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
  </Routes>
);

export default AppRoutes;
