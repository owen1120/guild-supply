export interface LoginPayload {
  email: string;
  password?: string;
}

export interface SignupPayload {
  name: string;
  dob: string;
  email: string;
  password?: string;
}

const BASE_URL = '/guild-supply/api/auth';

export const authService = {
  async login(payload: LoginPayload) {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  async signup(payload: SignupPayload) {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Signup failed');
    return response.json();
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${BASE_URL}/password/forgot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) throw new Error('Failed to send repair rune');
    return response.json();
  }
};