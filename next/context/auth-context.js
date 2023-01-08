import React           from "react";
import { useKeycloak } from "@react-keycloak/web";
import { useRouter }   from 'next/router';

const AuthContext = React.createContext({});

export { AuthContext };

export default function AuthProvider({ children }) {

    const router                    = useRouter();
    const [publicRoutes,]           = React.useState(['/welcome']);
    const { keycloak, initialized } = useKeycloak();

    React.useEffect(() => {
        if (initialized && !keycloak.authenticated && publicRoutes.indexOf(router.asPath) === -1) {
            login();
        }
    }, [initialized]);

    const login = () => {
        keycloak.login({redirectUri:`http://localhost:3000${router.asPath === '/' ? '/welcome' : router.asPath}`});
    }

    const logout = () => {
        keycloak.logout({redirectUri: 'http://localhost:3000/welcome'});
    }

    return (
        <AuthContext.Provider value={{user: keycloak?.idTokenParsed, logout, login, keycloak}}>
            {children}
        </AuthContext.Provider>
    );
}