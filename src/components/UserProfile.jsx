import React from "react";
import { useAuthContext } from "../contexts/auth.context"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate

const UserProfile = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate(); // สร้าง instance ของ useNavigate

  const handleLogout = () => {
    logout();
    navigate("/"); // เปลี่ยนเส้นทางไปที่หน้าโฮมหลังจากล็อกเอ้าท์
  };

  return (
    <div className="dropdown dropdown-end">
      {/* Avatar button */}
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            alt="User Profile"
            src="https://gitlab.com/eak022/image_com/-/raw/main/icons8-user-100.png"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-lg"
      >
        <li>
          <a onClick={handleLogout}>Logout</a>
          <a href="/profile">Profile</a> {/* เปลี่ยนเป็น href เพื่อไปที่หน้าโปรไฟล์ */}
        </li>
      </ul>
    </div>
  );
};

export default UserProfile;