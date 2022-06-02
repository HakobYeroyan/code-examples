import { API_KEY, BASE_URL } from '../../config.js';

class Auth {
  #baseUrl = 'https://identitytoolkit.googleapis.com/v1/accounts';
  #signUp = 'signUp';
  #signIn = 'signInWithPassword';

  async createUserInDb(data, uid) {
    try {
      const response = await fetch(`${BASE_URL}users/${uid}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }); 
  
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.log(error);
    }

  }

  async signUp(email, password, data) {
    try {
      const response = await fetch(`${this.#baseUrl}:${this.#signUp}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const responseData = await response.json();
      
      console.log(responseData)

      await this.createUserInDb(data, responseData.localId);

      location.href = 'index.html';

      return responseData;
    } catch (error) {
      console.log(error);
    }
  }

  async getUser(uid) {
    try {
      const response = await fetch(`${BASE_URL}users/${uid}.json`);
      const responseData = await response.json();

      localStorage.setItem('user_data', JSON.stringify(responseData));

      return responseData;
    } catch (error) {
      console.log(error);
    }
  }

  async signIn(email, password) {
    try {
      const response = await fetch(`${this.#baseUrl}:${this.#signIn}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        }),
      });

      const responseData = await response.json();

      localStorage.setItem('access_token', responseData.idToken);
      localStorage.setItem('user_id', responseData.localId);

      console.log(responseData);

      await this.getUser(responseData.localId);

      location.href = 'home.html';

      return responseData;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Auth;