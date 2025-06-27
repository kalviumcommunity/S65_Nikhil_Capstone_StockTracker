import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const navigate = useNavigate();
  const [apiMessage, setApiMessage] = useState(null); // For server messages
  const [isLoading, setIsLoading] = useState(false);  // For button loading state

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setApiMessage(null); // Reset previous messages

    try {
      const response = await fetch('http://localhost:9000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setApiMessage({ text: data.message || 'User created successfully!', isError: false });
        setTimeout(() => navigate('/Homepage'), 2000); // Navigate after 2 seconds
      } else {
        setApiMessage({ text: data.error || 'Registration failed', isError: true });
      }
    } catch (error) {
      setApiMessage({ text: 'Registration failed. Please try again.', isError: true });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 bg-black text-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-3xl font-bold mb-8">Create Account</h1>

          {/* API Message Display */}
          {apiMessage && (
            <div className={`mb-4 p-3 rounded-lg relative ${apiMessage.isError ? 'bg-red-900 text-red-100' : 'bg-green-900 text-green-100'}`}>
              {apiMessage.text}
              <button 
                onClick={() => setApiMessage(null)}
                className="absolute top-1 right-2 text-xl hover:text-white"
                aria-label="Close message"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full name</label>
              <input
                type="text"
                {...register('username', { 
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters'
                  }
                })}
                className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg border ${errors.username ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className={`w-full px-4 py-3 bg-gray-900 text-white rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-700'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : 'Sign up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image (uncomment if you want to use it) */}
      {/* <div className="hidden md:block md:w-1/2 bg-gray-100">
        <img
          src={SigninLogo}
          alt="Decorative"
          className="w-full h-full object-cover"
        />
      </div> */}
    </div>
  );
}