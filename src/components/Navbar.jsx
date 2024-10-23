import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import { useAuthContext } from '../contexts/auth.context';

const Navbar = () => {
  const { user } = useAuthContext();
  const menus = {
    ROLES_ADMIN: [
      { name: 'Add restaurant', link: '/add' },
      { name: 'Search', link: '/' },
    ],
    ROLES_USER: [{ name: 'Search', link: '/search' }],
    ROLES_MODERATOR: [
      { name: 'Add restaurant', link: '/add' },
      { name: 'Home', link: '/' },
    ],
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
            Zone Checker
        </Link>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {user ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span>Welcome,</span>
              <span className="text-red-500">{user.username}</span>
              {user.roles && user.roles.length > 0 ? (
                <div className="flex gap-2">
                  {user.roles.map((role, index) => (
                    <div key={index} className="badge text-xs badge-accent">
                      {role}
                    </div>
                  ))}
                </div>
              ) : (
                <span>No roles available</span>
              )}
            </div>
            {/* UserProfile positioned below the welcome message */}
            <UserProfile />
          </div>
        ) : (
          <div className="flex space-x-2 gap-1 ml-auto">
            <Link to="/login" className="btn btn-outline btn-accent">
              Login
            </Link>
            <LoginButton />
            <Link to="/register" className="btn btn-outline btn-primary">
              Register
            </Link>
            <RegisterButton />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;