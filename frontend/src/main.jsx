import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';
import './styles/admin.css';
import App from './App.jsx';
import { ContentProvider } from './context/ContentContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContentProvider>
    </BrowserRouter>
  </React.StrictMode>
);
