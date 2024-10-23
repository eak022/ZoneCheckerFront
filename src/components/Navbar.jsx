import React from 'react'; 
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import LoginButton from './LoginButton';
import RegisterButton from './RegisterButton';
import { useAuthContext } from '../contexts/auth.context';

const Navbar = () => {
  const { user } = useAuthContext();
  
  return (
    <div className="navbar bg-gray-800 text-white shadow-lg"> {/* ใช้ bg-gray-800 เพื่อเพิ่มความหรูหรา */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl hover:text-gray-300"> {/* เพิ่มการเปลี่ยนสีเมื่อ hover */}
          Zone Checker
        </Link>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span>Welcome,</span>
              <span className="font-semibold">{user.username}</span> {/* ใช้ font-semibold เพื่อให้เด่นขึ้น */}
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
            <UserProfile />
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link to="/login" className="btn btn-outline btn-accent hover:bg-accent hover:text-white transition"> {/* เพิ่ม hover effect */}
              Login
            </Link>
            <LoginButton />
            <Link to="/register" className="btn btn-outline btn-primary hover:bg-primary hover:text-white transition">
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
