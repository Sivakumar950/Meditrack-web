import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Sidebar({ username, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      {/* Menu Button (Visible when sidebar is closed) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed top-4 left-4 z-50 p-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-200 ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-0'
        }`}
      >
        <div className="flex justify-between items-center p-6">
          <h3 className="text-2xl font-bold">{username || 'User'}</h3>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-300 focus:outline-none text-2xl"
            >
              ✕
            </button>
          )}
        </div>
        {isOpen && (
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/120"
              alt="User Avatar"
              className="w-28 h-28 rounded-full mb-6 border-4 border-gray-600"
            />
            <nav className="mt-6 w-full">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/about"
                    className="block px-6 py-3 text-lg hover:bg-gray-700 transition duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-6 py-3 text-lg hover:bg-gray-700 transition duration-200"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Overlay (Closes sidebar when clicked outside) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
}

export default Sidebar;