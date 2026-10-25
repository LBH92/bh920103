import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SplashScreen } from '@capacitor/splash-screen';

SplashScreen.hide();
createRoot(document.getElementById('root')!).render(<App />);

