"use client"
import { useState,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Router from 'next/router';
import Loader from './components/Loading';

const apiURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const delay = (s) => new Promise(resolve => setTimeout(resolve, s));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    Router.events.on("routeChangeStart", (url)=>{
      setIsLoading(true)
    });

    Router.events.on("routeChangeComplete", (url)=>{
      setIsLoading(false)
    });

    Router.events.on("routeChangeError", (url) =>{
      setIsLoading(false)
    });

  }, [Router])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST Request to Server
      setIsLoading(true);
      await delay(2000)
      const response = await fetch(`${apiURL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      // Handle the response accordingly
      if (response.ok) {
        // Login successful, redirect or handle as needed
        localStorage.setItem('User',formData.username);
        router.push('/dashboard');
      } else {
        // Login failed, handle the error
        const errorData = await response.json();
        setIsLoading(false);
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='h-full w-full'>{isLoading && <Loader />}
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-300">
        <div className="bg-gray-200 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-4xl text-blue-950 mb-4 font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-800 from-sky-400">Short Links</h1>
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Login</h2>
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
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Log In
            </button>
          </form>
          <p className="text-gray-800">
            Don&apos;t have an account?{' '}
            <Link legacyBehavior href="/register">
              <a className="text-blue-500">Register here</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}
