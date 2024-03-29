import auth0 from 'auth0-js';

const REDIRECT_ON_LOGIN = 'redirect_on_login';

let _idToken = null;
let _accessToken = null;
let _scopes = null;
let _expiresAt = null;

export default class Auth {
    constructor(history) {
        this.history = history;
        this.userProfile = null;
        this.requestedScopes = "openid profile email read:courses";
        this.auth0 = new auth0.WebAuth({
            domain: process.env.REACT_APP_AUTH0_DOMAIN,
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
            responseType: "token id_token",
            scope: this.requestedScopes
        })
    }

    login = () => {
        localStorage.setItem(
            REDIRECT_ON_LOGIN,
            JSON.stringify(this.history.location)
        );
        this.auth0.authorize();
    };

    handleAuthentication = () => {
        this.auth0.parseHash((err, authResult) => {
          if (authResult && authResult.accessToken && authResult.idToken) {
              this.setSession(authResult);
              const redirectLocation = localStorage.getItem(
                  REDIRECT_ON_LOGIN === 'undefined'? '/' : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN))
              );
              this.history.push(redirectLocation);
          }  else if(err) {
              this.history.push('/');
              alert(`Error: ${err.error}. Check the console for further details.`)
              console.log(err);
          }
        })
        localStorage.removeItem(REDIRECT_ON_LOGIN);
    }

    setSession = authResult => {
        _expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

        _scopes = authResult.scope || this.requestedScopes || '';

        _accessToken = authResult.accessToken;
        _idToken = authResult.idToken;
    }

    isAuthenticated() {
        return new Date().getTime() < _expiresAt;
    }

    logout = () => {
        this.auth0.logout({
            clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
            returnTo: 'http://localhost:3000'
        })
    }

    getAccessToken = () => {
        if (!_accessToken) {
            throw new Error('No access token found');
        }
        return _accessToken;

    }

    getProfile = cb => {
        if (this.userProfile) return cb(this.userProfile);
        this.auth0.client.userInfo(this.getAccessToken(), (err, profile) => {
            if (profile) this.userProfile = profile;
            cb(profile, err);
        })
    }

    userHasScopes(scopes) {
        console.log(scopes);
        const grantedScopes = (
            JSON.parse(localStorage.getItem('scopes')) || ''
        ).split(' ');
        console.log(grantedScopes);
        return scopes.every(scope => grantedScopes.includes(scope));
    }
}