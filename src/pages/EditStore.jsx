import React, { useState, useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useStoreContext } from "../contexts/store.contsxt"; // Import the StoreContext

const EditStore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchStore, updateStore } = useStoreContext(); // Use the StoreContext

  const [store, setStore] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    deliveryRadius: "",
  });

  useEffect(() => {
    const loadStore = async () => {
      try {
        const storeData = await fetchStore(id); // Fetch the store data by ID
        if (storeData) {
          setStore(storeData); // Set the fetched store data
        } else {
          Swal.fire({
            title: "Error",
            text: "Failed to fetch store data.",
            icon: "error",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while fetching store data.",
          icon: "error",
        });
      }
    };

    loadStore();
  }, [id, fetchStore]);

  const handleChange = (e) => {
    setStore({ ...store, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting data...", store);
      const response = await updateStore(id, store);
      console.log("Update response:", response);
      if (response && response.status === 200) { // Check response status
        Swal.fire({
          title: "Success",
          text: "Store updated successfully",
          icon: "success",
        }).then(() => {
          navigate("/"); // Navigate to home page
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        title: "Update Failed",
        text: error.response?.data?.message || error.message,
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to the homepage when cancel is clicked
  };

  return (
    <div className="container flex flex-col items-center p-4 mx-auto space-y-6">
      <div className="card bg-base-100 w-full max-w-2xl shadow-2xl">
        <form className="card-body" onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Store Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              required
              name="name"
              value={store.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              placeholder="Enter address"
              className="input input-bordered"
              required
              name="address"
              value={store.address || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Latitude</span>
            </label>
            <input
              type="number"
              placeholder="Enter latitude"
              className="input input-bordered"
              required
              name="latitude"
              value={store.latitude || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Longitude</span>
            </label>
            <input
              type="number"
              placeholder="Enter longitude"
              className="input input-bordered"
              required
              name="longitude"
              value={store.longitude || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Delivery Radius</span>
            </label>
            <input
              type="number"
              placeholder="Enter delivery radius"
              className="input input-bordered"
              required
              name="deliveryRadius"
              value={store.deliveryRadius || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-control mt-6 flex flex-row justify-end">
            <button className="btn btn-outline btn-primary" type="submit">
              Update
            </button>
            <button
              type="button"
              className="btn btn-outline btn-warning ml-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStore;
