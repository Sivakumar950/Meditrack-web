import React, { useState } from 'react';
import { CognitoIdentityProviderClient, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

const client = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_COGNITO_REGION,
});

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      AuthParameters: { USERNAME: email, PASSWORD: password },
    });
    try {
      const response = await client.send(command);
      localStorage.setItem('accessToken', response.AuthenticationResult.AccessToken);
      onLogin();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300 space-y-10">
        <h2 className="text-4xl font-bold text-gray-800 text-center">Login</h2>
        <form onSubmit={handleLogin} className="space-y-8">
          {/* Email Input */}
          <div className="space-y-3">
            <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-lg"
                placeholder="Enter your email"
              />
            </div>
          </div>
          {/* Password Input */}
          <div className="space-y-3">
            <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-lg"
                placeholder="Enter your password"
              />
            </div>
          </div>
          {/* Login Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 border-2 border-blue-700 rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-lg text-red-600">{error}</p>}
        <p className="mt-4 text-center text-lg text-gray-600">
          Don’t have an account?{' '}
          <a href="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;