// Register.js
"use client"
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm Password Logic
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      // Send POST Request to Server
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      // Handle the response accordingly
      if (response.ok) {
        // Registration successful, redirect or handle as needed
        localStorage.setItem("User", formData.username);
        router.push('/dashboard');
      } else {
        // Registration failed, handle the error
        const errorData = await response.json();
        alert(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      alert("Error during registration!");
      console.error('Error during registration:', error);
    }
  };

  return (
    <div>
      <div className="h-screen flex items-center justify-center bg-gray-300">
        <div className="p-8 rounded shadow-md w-full max-w-md bg-gray-200">
        <h1 className="text-4xl text-blue-950 mb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-800 from-sky-400">Short Links</h1>
          <h1 className="text-gray-800 text-2xl font-bold mb-4">Register</h1>
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="text-black border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="text-black border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="text-black border rounded w-full py-2 px-3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Register
            </button>
          </form>
          <p className='text-gray-800'>
            or{' '}
            <Link legacyBehavior href="/">
              <a className="text-blue-500">Login?</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
