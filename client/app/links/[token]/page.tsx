"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const TokenPage = (token) => {
  const router = useRouter();
  const [originalURL, setOriginalURL] = useState('');

  useEffect(() => {
    if (token) {
      // Fetch the original URL and update the click count from the server using the provided token
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlinks/shortlinks/${token.params.token}`, {
        method: 'GET', // Use GET to retrieve the original URL and update the click count
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Link not found');
          }
        })
        .then((data) => {
          setOriginalURL(data.originalURL);
          // Redirect to the original URL
          window.location.href = data.originalURL;
          
          // Update click count by sending a POST request to the backend
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlinks/updateClickCount/${token.params.token}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              if (!response.ok) {
                console.error('Failed to update click count');
              }
            })
            .catch((error) => {
              console.error('Error updating click count:', error);
            });
        })
        .catch((error) => {
          console.error('Error fetching original URL:', error);
          // Handle error, e.g., redirect to an error page
        });
    }
  }, [token]);

  return (
    <div>
      <h1>Redirecting...</h1>
      {/* Optional: Display the original URL if needed */}
      {originalURL && (
        <p>
          Original URL: 
          <a href={originalURL} target="_blank" rel="noopener noreferrer">
            {originalURL}
          </a>
        </p>
      )}
    </div>
  );
};

export default TokenPage;
