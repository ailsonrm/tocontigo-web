import React, {
  createContext,
  useEffect,
  useMemo,
  useContext,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from './apiClient';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const initialState = {
  isLoading: true,
  signedIn: false,
  currentUser: null,
  currentOrganization: null,
  handleUpdateCurrentOrganization: () => {},
  handleLogin: () => {},
  handleLogout: () => {},
  handleForgot: () => {},
  handleReset: () => {},
  getRedirectUrl: () => {}
};

const tokenName = 'JWT';

export const ContextUser = createContext(initialState);

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const UserProvider = ({ children }) => {
  const { selfurl } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
    autoHideDuration: 5000
  });

  function SlideTransition(props) {
    return <Slide {...props} direction="down" />;
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const showSnackbar = (message, severity = 'info', position = { vertical: 'top', horizontal: 'center' }) => {
    setSnackbar({ open: true, message, severity, position });
  };

  const saveToken = tokenString => {
    localStorage.setItem(tokenName, tokenString);
  };

  const removeToken = () => localStorage.removeItem(tokenName);

  const loginRedirectRules = {
    ADMIN: {
      path: '/admin'
    },
    MANAGER: {
      path: '/manager'
    }
  };

  const getRedirectUrl = role => {
    if (role === undefined) {
      return '/sem-permissao';
    }

    return `${loginRedirectRules[role].path}`;
  };

  const getMeRoute = () => {
    api
      .get('/lawyer/me')
      .then(response => {
        const { user } = response.data;
        setSignedIn(true);
        navigate(getRedirectUrl(user.role.name));
        setCurrentUser(response.data.user);
      })
      .catch(() => {
        setSignedIn(false);
        setCurrentUser(null);
        removeToken();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLogin = async credentials => {
    await api
      .post('/lawyer/create_session', credentials)
      .then(response => {
        const { user } = response.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
        saveToken(user.token);
        setSignedIn(true);
        setCurrentUser(user);

        navigate(getRedirectUrl(user.role.name));
      })
      .catch(error => showSnackbar(error.response.data.error, 'error'));
  };

  const handleForgot = async email => {
    await api
      .post('/auth/forgot_password', { email })
      .then(() => {
        showSnackbar('Enviamos um e-mail para redefinir sua senha.', 'success');
      })
      .catch(error => showSnackbar(error.response.data.error, 'error'));
  };

  const handleReset = async (token, newPassword) => {
    await api
      .post('/auth/reset_password', { token, newPassword })
      .then(() => {
        enqueueSnackbar('Sua senha foi redefinida com sucesso.');
        navigate('/acessar');
      })
      .catch(error => showSnackbar(error.response.data.error, 'error'));
  };

  const handleLogout = () => {
    removeToken();
    navigate('/acessar');
  };

  useEffect(() => {
    const fullUrl = window.location.href;
    const path = fullUrl.split(window.location.origin)[1];

    if (fullUrl.includes('/self_register')) {
      navigate(path);
    } else {
      getMeRoute();
    }
  }, []);

  const exportData = useMemo(
    () => ({
      isLoading,
      signedIn,
      currentUser,
      handleLogin,
      handleLogout,
      handleForgot,
      handleReset,
      getRedirectUrl,
      showSnackbar
    }),
    [signedIn, currentUser, isLoading]
  );

  return (
    <ContextUser.Provider value={exportData}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.autoHideDuration}
        onClose={handleCloseSnackbar}
        //anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        anchorOrigin={snackbar.position}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      {children}
    </ContextUser.Provider>
  );
};

export default UserProvider;
