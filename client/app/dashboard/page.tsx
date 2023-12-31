// Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import CreateLink from '../components/CreateLink';
import DeleteButton from '../components/DeleteButton';
import moment from 'moment-timezone';  // Import moment from moment-timezone
import { useRouter } from 'next/navigation';
import Router from 'next/router';
import Loader from '../components/Loading';
import CookieError from '../components/CookieError';
interface Link {
  token: string;
  originalURL: string;
  expirationTime: Date; // Assuming it's a string for formatting purposes
  clickCount: number; // Assuming it's a number
}

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCookieError, setIsCookieError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlinks/dashboard`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (!response.ok) {
          console.log(response);
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setUser(data.user);
        setLinks(data.links);
      } catch (error) {
        console.error('Error fetching short links:', error);
        setIsCookieError(true);
        // Handle the error as needed, for example, you can set an error state
        // setError(error.message);
      }
    };
  
    fetchData();
  }, [isLoading]);
  

  const delay = (s) => new Promise(resolve => setTimeout(resolve, s));
  

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

  const handleCreateLink = async (originalURL: string, customToken?: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlinks/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ originalURL, customToken }),
      });

      if (response.ok) {
        await router.refresh();
      } else {
        throw new Error('Failed to create short link');
      }
    } catch (error) {
      console.error('Error creating short link:', error);
      alert('Error creating short link');
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    // Refresh the page after deleting a link
    setIsLoading(true);
    await delay(500);
    setIsLoading(false);
    await router.refresh();
  };

  return (
    <>{isLoading && <Loader />}{isCookieError && <CookieError />}
    <div className='m-2'>
      <CreateLink onCreate={handleCreateLink} />
      <h1 className='text-2xl font-bold mb-4 text-gray-800'>Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {links.map((link) => (
          <div
            key={link.token}
            className='p-4 rounded shadow-md hover:shadow-xl transition duration-400 relative border border-gray-400 rounded-lg'
          >
            <p className='text-gray-700 mb-2'>Token: {link.token}</p>
            <p className='text-gray-700 mb-2'>
              Short Link:{' '}
              <a
                href={`/links/${link.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className='text-blue-400'
              >
                {window.location.host + `/links/${link.token}`}
              </a>
            </p>
            <p className='text-gray-700 mb-2'>
              Original URL:{' '}
              <a href={link.originalURL} target="_blank" rel="noopener noreferrer" className='text-blue-400'>
                {link.originalURL}
              </a>
            </p>
            <p className='text-gray-500'>
              Expiration Time: {moment(link.expirationTime).tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss')}
            </p>
            <p className='text-gray-500'>Click Count: {link.clickCount}</p>
            <div className='flex items-center justify-end'><DeleteButton token={link.token} onDelete={handleDelete} /></div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Dashboard;
