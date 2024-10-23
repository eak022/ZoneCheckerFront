import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service"; // นำเข้า AuthService
import Swal from "sweetalert2";

const Register = () => {
  // State to hold form values
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // To handle form submission state

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Set submitting state to true
      // Check if all fields are filled
      if (!user.username || !user.password || !user.email) {
        Swal.fire({
          title: "Validation Error",
          text: "Please fill in all fields.",
          icon: "warning",
        });
        return;
      }

      // Call AuthService.register to handle registration
      const response = await AuthService.register(user.username, user.email, user.password);

      // Assuming response contains the user data and token
      const userData = response.data;
      localStorage.setItem("accessToken", JSON.stringify(userData.accessToken));
      localStorage.setItem("user", JSON.stringify(userData));

      Swal.fire({
        title: "User Registered",
        text: "You have been successfully registered!",
        icon: "success",
      });

      setUser({
        username: "",
        password: "",
        email: "",
      });

      navigate("/login"); // Redirect to login or another route after successful registration
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text:
          error.response && error.response.data.message
            ? error.response.data.message
            : "Unknown error", // Safeguard in case error.response.data.message is undefined
        icon: "error",
      });
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleCancel = () => {
    setUser({
      username: "",
      password: "",
      email: "",
    });
    navigate("/");
  };

  return (
    <div className="container mx-auto max-w-96 my-auto p-4">
      {/* Username Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        <input
          type="text"
          name="username"
          className="grow"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />
      </label>

      {/* Password Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="password"
          name="password"
          className="grow"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
      </label>

      {/* Email Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
          <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
        </svg>
        <input
          type="text"
          name="email"
          className="grow"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
      </label>

      {/* Buttons */}
      <div className="flex gap-2">
        <button 
          className="btn btn-outline btn-primary" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
        <button 
          className="btn btn-outline btn-warning" 
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Register;