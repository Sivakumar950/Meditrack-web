import React, { useState } from 'react';
import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { useNavigate } from 'react-router-dom';

const client = new CognitoIdentityProviderClient({
  region: import.meta.env.VITE_COGNITO_REGION,
});

function Signup() {
  const [email, setEmail] = useState('');
  const [preferredUsername, setPreferredUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const command = new SignUpCommand({
      ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'preferred_username', Value: preferredUsername },
        { Name: 'name', Value: name },
      ],
    });
    try {
      await client.send(command);
      navigate('/verify-email', { state: { email } });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border-2 border-gray-300 space-y-10">
        <h2 className="text-4xl font-bold text-gray-800 text-center">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-8">
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
          {/* Preferred Username Input */}
          <div className="space-y-3">
            <label htmlFor="username" className="block text-lg font-semibold text-gray-700">
              Preferred Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                value={preferredUsername}
                onChange={(e) => setPreferredUsername(e.target.value)}
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-lg"
                placeholder="Choose a username"
              />
            </div>
          </div>
          {/* Full Name Input */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
              Full Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-lg"
                placeholder="Enter your full name"
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
          {/* Confirm Password Input */}
          <div className="space-y-3">
            <label htmlFor="confirm-password" className="block text-lg font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="appearance-none block w-full px-4 py-3 border-2 border-gray-400 rounded-lg shadow-md bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-blue-600 text-lg"
                placeholder="Confirm your password"
              />
            </div>
          </div>
          {/* Signup Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 px-6 border-2 border-blue-700 rounded-lg shadow-lg text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>
        {error && <p className="mt-4 text-center text-lg text-red-600">{error}</p>}
        <p className="mt-4 text-center text-lg text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;