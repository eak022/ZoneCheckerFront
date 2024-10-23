import React, { useState } from "react";   
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useStoreContext } from "../contexts/store.contsxt"; // Use StoreContext instead of Product
import { useAuthContext } from "../contexts/auth.context"; // Import useAuthContext

const AddStore = () => {
  const [store, setStore] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
  });

  const { addStore } = useStoreContext(); // Use addStore from context
  const { user } = useAuthContext(); // Get user from context
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add adminId from the user context
    const storeData = { ...store, adminId: user.id }; // Add adminId to store data

    try {
      await addStore(storeData); // Pass the modified store data
      Swal.fire({
        title: "Add Store",
        text: "Store Added Successfully",
        icon: "success",
      });
      setStore({
        name: "",
        address: "",
        latitude: "",
        longitude: "",
        deliveryRadius: "",
      });
    } catch (error) {
      Swal.fire({
        title: "Add Store",
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate('/'); // Redirect to home page
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setStore((prevStore) => ({
          ...prevStore,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
      }, (error) => {
        Swal.fire({
          title: "Location Error",
          text: "Unable to retrieve location. Please enter it manually.",
          icon: "error",
        });
      });
    } else {
      Swal.fire({
        title: "Geolocation Not Supported",
        text: "Your browser does not support geolocation.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen">
      <div className="w-1/2 max-w-md">
        <h1 className="text-2xl text-center mb-6">Add Store</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="w-full">Store Name</span>
              <input
                type="text"
                name="name"
                className="w-full text-sm"
                placeholder="Store Name"
                value={store.name}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="w-full">Address</span>
              <input
                type="text"
                name="address"
                className="w-full text-sm"
                placeholder="Address"
                value={store.address}
                onChange={handleChange}
                required
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="w-full">Latitude</span>
              <input
                type="number"
                step="any"
                name="latitude"
                className="w-full text-sm"
                placeholder="Latitude"
                value={store.latitude}
                onChange={handleChange}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="w-full">Longitude</span>
              <input
                type="number"
                step="any"
                name="longitude"
                className="w-full text-sm"
                placeholder="Longitude"
                value={store.longitude}
                onChange={handleChange}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 mb-4">
              <span className="w-full">Delivery Radius (km)</span>
              <input
                type="number"
                step="any"
                name="deliveryRadius"
                className="w-full text-sm"
                placeholder="Delivery Radius"
                value={store.deliveryRadius}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="flex justify-end mr-3 space-x-2">
            <button type="button" onClick={getCurrentLocation} className="btn btn-outline btn-info">
              Get Current Location
            </button>
            <button type="submit" className="btn btn-outline btn-success">
              Add Store
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-outline btn-warning">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStore;
