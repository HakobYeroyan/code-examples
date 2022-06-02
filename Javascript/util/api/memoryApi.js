import { BASE_URL } from '../../config.js';

class Memory {
  #accessToken
  #uid
  #endpoint

  constructor() {
    this.#accessToken = localStorage.getItem('access_token');
    this.#uid = localStorage.getItem('user_id');
    this.#endpoint = 'memories';
  }

  async createMemory(data) {
    const response = await fetch(`${BASE_URL}${this.#endpoint}/${this.#uid}.json?auth=${this.#accessToken}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();

    console.log(responseData);

    return responseData;
  }

  async getMemories() {
    try {
      const response = await fetch(`${BASE_URL}${this.#endpoint}/${this.#uid}.json?auth=${this.#accessToken}`);
      const responseData = await response.json();
      console.log(response);

      if(!response.ok) {
        throw new Error(responseData.error || 'Something went wrong.');
      }
  
      console.log(responseData);
  
      const arr = this.#transformObjectToArray(responseData).sort(this.#sortArrByDate);
      return arr.map(this.#transformArr);
    } catch (e) {
      console.log(e);
    }
  }

  async getAllMemories() {
    const response = await fetch(`${BASE_URL}${this.#endpoint}.json?auth=${this.#accessToken}`);
    const responseData = await response.json();

    console.log(responseData);

    return this.#transformObjectsToArrays(responseData).sort(this.#sortArrByDate);
  }

  #transformObjectToArray(obj) {
    if (!Object.entries(obj)) {
      return [];
    }

    return Object.entries(obj).map(([key, value]) => {
      return {
        id: key,
        ...value
      };
    });
  }

  #transformObjectsToArrays(obj) {
    return Object.entries(obj).map(([key, value]) => {
      return Object.entries(value).map(([childKey, childValue]) => {
        return {
          userId: key,
          id: childKey,
          ...childValue,
        };
      });
    }).flat(1);
  }

  #transformArr(memory) {
    return {
      ...memory,
      date: new Date(memory.date).toLocaleDateString(),
    };
  }

  #sortArrByDate(a, b) {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    }
    return 0;
  }
}

export default new Memory;