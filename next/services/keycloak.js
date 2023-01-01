import Keycloak from 'keycloak-js';

let keycloakInstance = null;
if (typeof window === "undefined") {
    keycloakInstance = () => null;
} else {
    keycloakInstance = new Keycloak({
        url: 'http://localhost:8080/',
        realm: 'local',
        clientId: 'local',
    });
}

export { keycloakInstance }