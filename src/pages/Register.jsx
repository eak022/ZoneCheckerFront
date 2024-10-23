import React, { useState } from "react";  
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service"; // นำเข้า AuthService
import Swal from "sweetalert2";

const Register = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    latitude: "",
    longitude: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      // Check if all fields are filled
      if (!user.username || !user.password || !user.email || !user.latitude || !user.longitude) {
        Swal.fire({
          title: "Validation Error",
          text: "Please fill in all fields.",
          icon: "warning",
        });
        return;
      }

      // Call register from AuthService to handle registration
      await AuthService.register(user.username, user.email, user.password, user.latitude, user.longitude); // ส่งข้อมูลผู้ใช้ไปยัง AuthService

      Swal.fire({
        title: "User Registered",
        text: "You have been successfully registered!",
        icon: "success",
      });

      setUser({
        username: "",
        password: "",
        email: "",
        latitude: "",
        longitude: "",
      });

      navigate("/login"); // Redirect to login or another route after successful registration
    } catch (error) {
      Swal.fire({
        title: "Registration Failed",
        text: error.message || "Unknown error",
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
      latitude: "",
      longitude: "",
    });
    navigate("/");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUser({
            ...user,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        () => {
          Swal.fire({
            title: "Geolocation Error",
            text: "Unable to retrieve your location.",
            icon: "error",
          });
        }
      );
    } else {
      Swal.fire({
        title: "Geolocation Error",
        text: "Your browser doesn't support geolocation.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto max-w-96 my-auto p-4">
      {/* Username Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
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
        <input
          type="text"
          name="email"
          className="grow"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
      </label>

      {/* Latitude Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="latitude"
          className="grow"
          placeholder="Latitude"
          value={user.latitude}
          onChange={handleChange} 
        />
      </label>

      {/* Longitude Input */}
      <label className="input input-bordered flex items-center gap-2 w-full mb-4">
        <input
          type="text"
          name="longitude"
          className="grow"
          placeholder="Longitude"
          value={user.longitude}
          onChange={handleChange} 
        />
      </label>

      {/* Button to get current location */}
      <button className="btn btn-outline btn-secondary mb-4" onClick={getCurrentLocation}>
        Get Current Location
      </button>

      {/* Buttons for submit and cancel */}
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
