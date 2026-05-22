import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AppRouter from './routes/AppRouter';
import CustomCursor from './components/common/CustomCursor';
import './styles/globals.css';
import './styles/animations.css';
import './assets/icons/icon-animations.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <div className="relative min-h-screen">
            {/* Scanline CRT Overlay */}
            <div className="scanlines pointer-events-none fixed inset-0 z-50 opacity-[0.03]" />
            
            {/* Custom futuristic crosshair cursor */}
            <CustomCursor />

            <AppRouter />
          </div>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
