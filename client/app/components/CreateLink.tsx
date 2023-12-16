// 'use client'
import React, { useState } from 'react';

const CreateLink: React.FC<{ onCreate: (originalURL: string, customToken?: string) => void }> = ({ onCreate }) => {
  const [originalURL, setOriginalURL] = useState('');
  const [customToken, setCustomToken] = useState('');

  const handleCreate = () => {
    if (originalURL) {
      onCreate(originalURL, customToken.trim() || undefined);
      setOriginalURL('');
      setCustomToken('');
    }
  };

  return (
    <div className="mb-4 border border-gray-400 p-4 rounded-lg items-center">
      <h2 className="text-gray-800 text-xl font-bold mb-2">Create Short Link</h2>
      <div className="flex">
        <input
          type="url"
          placeholder="Enter the original URL*"
          value={originalURL}
          onChange={(e) => setOriginalURL(e.target.value)}
          className="text-black border rounded-l py-2 px-3 w-full"
        />
        <input
          type="text"
          placeholder="custom token"
          value={customToken}
          onChange={(e) => setCustomToken(e.target.value)}
          className="text-black border rounded-r py-2 px-3 w-full"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white py-2 px-4 rounded-r hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </div>
  );
};

export default CreateLink;
