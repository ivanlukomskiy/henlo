import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import App from './App.tsx';
import './index.css';
import { HashRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
