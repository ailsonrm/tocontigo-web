import './custom-bootstrap-colors.scss';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppRoutes from './app-routes';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
