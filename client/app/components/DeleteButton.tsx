// DeleteButton.tsx
import React from 'react';

interface DeleteButtonProps {
  token: string;
  onDelete: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ token, onDelete }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/shortlinks/delete/${token}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        onDelete();
      } else {
        console.error('Delete failed');
      }
    } catch (error) {
      console.error('Error during delete:', error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
    >
      Delete
    </button>
  );
};

export default DeleteButton;
