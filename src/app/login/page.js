'use client';

import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();

  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setSuccessMessage('Login successful');
          setServerError('');
          setTimeout(() => setSuccessMessage(''), 300);
          router.push('/dashboard');
        } else {
          const data = await response.json();
          setServerError(data.error);
          setTimeout(() => setServerError(''), 3000);
        }
      } catch (error) {
        console.error('Error:', error);
        setServerError('An unexpected error occurred');
        setTimeout(() => setServerError(''), 3000);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 -mt-10">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              type="email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              type="password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        {successMessage && (
          <div className="text-green-500 text-center mt-4">{successMessage}</div>
        )}
        {serverError && (
          <div className="text-red-500 text-center mt-4">{serverError}</div>
        )}
        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{' '}
          <a
            href="/signup"
            className="text-blue-500 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
