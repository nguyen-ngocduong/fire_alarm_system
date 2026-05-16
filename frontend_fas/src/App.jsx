import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AppRouter from './routes/AppRouter';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <AppRouter />
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
