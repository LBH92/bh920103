import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SplashScreen } from '@capacitor/splash-screen';
import { setupApiInterceptor } from './utils/api';
import { crashlyticsService } from './services/crashlyticsService';

setupApiInterceptor();
crashlyticsService.init();
SplashScreen.hide();
console.log('App starting...');
createRoot(document.getElementById('root')!).render(<App />);

