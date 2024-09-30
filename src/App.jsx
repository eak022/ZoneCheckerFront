import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import L from "leaflet"; // Import leaflet
import "./App.css";
const base_url = import.meta.env.VITE_BASE_URL;

// Define custom icon for house
const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/69/69524.png", // URL for house icon
  iconSize: [38, 38], // size of the icon
  iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -40], // point from which the popup should open relative to the iconAnchor
});

const App = () => {
  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [stores, setStores] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null); // State to store user-selected position

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get(`${base_url}/api/stores`);
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchStore();
  }, []);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    setSelectedPosition([lat, lng]); // Update selected position when user clicks on the map
  };

  return (
    <div>
      <h1>Store Delivery Zone Checker</h1>
      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
          onClick={handleMapClick} // Add onClick handler to capture user click
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marker for the initial position */}
          <Marker position={center}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>

          {/* Render markers for all store locations */}
          {stores.map((store) => (
            <Marker key={store.id} position={[store.lat, store.lng]}>
              <Popup>
                <strong>{store.name}</strong>
                <br />
                {store.address}
                <br />
                Tel: {store.tel}
                <br />
                <a href={store.direction} target="_blank" rel="noreferrer">
                  Get Directions
                </a>
              </Popup>
            </Marker>
          ))}

          {/* Render a marker with house icon for the user's selected position */}
          {selectedPosition && (
            <Marker position={selectedPosition} icon={houseIcon}>
              <Popup>You clicked here!</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
