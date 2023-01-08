import '../styles/globals.css';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import { keycloakInstance }      from '../services/keycloak';
import React                     from 'react';
import AuthProvider              from '../context/auth-context';

export default function App({ Component, pageProps: {session, ...pageProps} }) {

  if (typeof window === 'undefined') {
    return <Component {...pageProps} />;
  }

  return (
    <ReactKeycloakProvider 
      authClient={keycloakInstance} 
      autoRefreshToken={false}
      LoadingComponent={<Component {...pageProps} />}
      initOptions={{ 
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      }}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ReactKeycloakProvider>
  );
}