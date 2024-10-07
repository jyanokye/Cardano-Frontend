// auth.js
export class Auth {
    constructor(useGoogleAuth = false) {
      if (useGoogleAuth) {
        this.googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
        this.googleClientSecret = 'YOUR_GOOGLE_CLIENT_SECRET';
        this.redirectUri = 'YOUR_REDIRECT_URI';
      }
    }
  
    // Credentials-based authentication (dynamic credentials handling)
    async Credentials(credentials, endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const user = await response.json();
        return user;
  
      } catch (error) {
        console.error('Error during credentials authentication:', error);
        throw error;
      }
    }
  
    // Google OAuth2 Authentication (this will only work if the constructor was called with useGoogleAuth = true)
    async Google(authCode) {
      if (!this.googleClientId || !this.googleClientSecret || !this.redirectUri) {
        throw new Error('Google OAuth2 is not initialized.');
      }
  
      try {
        const params = new URLSearchParams();
        params.append('code', authCode);
        params.append('client_id', this.googleClientId);
        params.append('client_secret', this.googleClientSecret);
        params.append('redirect_uri', this.redirectUri);
        params.append('grant_type', 'authorization_code');
  
        const response = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
  
        const tokenData = await response.json();
        const accessToken = tokenData.access_token;
  
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!userInfoResponse.ok) {
          throw new Error(`Error fetching user info: ${userInfoResponse.statusText}`);
        }
  
        const userInfo = await userInfoResponse.json();
        return userInfo;
  
      } catch (error) {
        console.error('Error during Google OAuth2 authentication:', error);
        throw error;
      }
    }
  }
  