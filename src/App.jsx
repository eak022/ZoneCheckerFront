import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import axios from "axios";
import Swal from "sweetalert2";
import "./App.css";

const base_url = import.meta.env.VITE_API_BASE_URL;

const App = () => {
  const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
  const [stores, setStores] = useState([]);
  const [mylocation, setMylocation] = useState({ lat: null, lng: null });
  const [deliveryZone, setDeliveryZone] = useState({
    lat: null,
    lng: null,
    radius: 700,
  });
  const [selectedStore, setSelectedStore] = useState(null); // สถานะร้านค้าที่เลือก

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const phi_1 = (lat1 * Math.PI) / 180;
    const phi_2 = (lat2 * Math.PI) / 180;

    const delta_phi = ((lat2 - lat1) * Math.PI) / 180;
    const delta_lambda = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(delta_phi / 2) * Math.sin(delta_phi / 2) +
      Math.cos(phi_1) *
        Math.cos(phi_2) *
        Math.sin(delta_lambda / 2) *
        Math.sin(delta_lambda / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(base_url + "/api/stores");
        console.log(response.data);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, []);

  const Locationmap = () => {
    useMapEvent({
      click(e) {
        const { lat, lng } = e.latlng;
        setMylocation({ lat, lng });
        console.log("Click at latitude: " + lat + " longitude: " + lng);
      },
    });

    return (
      <Marker position={[mylocation.lat, mylocation.lng]} icon={myLocationIcon}>
        <Popup>
          Your Location. <br /> Customize as needed.
        </Popup>
      </Marker>
    );
  };

  // ไอคอนต่างๆ
  const defaultIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=21242&format=png&color=000000",
    iconSize: [25, 26],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const selectedIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=21240&format=png&color=000000",
    iconSize: [25, 26],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const myLocationIcon = new Icon({
    iconUrl:
      "https://img.icons8.com/?size=100&id=wFfu6zXx15Yk&format=png&color=000000",
    iconSize: [25, 26],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setMylocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  const handleLocationCheck = () => {
    if (mylocation.lat === null || mylocation.lng === null) {
      Swal.fire({
        title: "Error",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!deliveryZone.lat || !deliveryZone.lng) {
      Swal.fire({
        title: "Error",
        text: "Please select a valid store location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const distance = calculateDistance(
      mylocation.lat,
      mylocation.lng,
      deliveryZone.lat,
      deliveryZone.lng
    );

    if (distance <= deliveryZone.radius) {
      Swal.fire({
        title: "Success",
        text: "You are within the delivery zone.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Sorry",
        text: "You are outside the delivery zone.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <h1>Store Delivery Zone Checker</h1>
      <button onClick={handleGetLocation}>Get My Location</button>
      <button onClick={handleLocationCheck}>Check Delivery Availability</button>
      <div>
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "75vh", width: "100vw" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Display all stores on map */}
          {stores &&
            stores.map((store) => {
              return (
                <Marker
                  position={[store.lat, store.lng]}
                  key={store.id}
                  icon={selectedStore === store.id ? selectedIcon : defaultIcon} // เปลี่ยนสีไอคอนตามร้านที่เลือก
                  eventHandlers={{
                    click: () => {
                      setDeliveryZone({
                        lat: store.lat,
                        lng: store.lng,
                        radius: 700, // สามารถปรับ radius ได้
                      });
                      setSelectedStore(store.id); // ตั้งค่าให้ร้านค้าที่ถูกเลือก
                      Swal.fire({
                        title: "Store Selected",
                        text: `You have selected ${store.name} as your delivery zone.`,
                        icon: "info",
                        confirmButtonText: "OK",
                      });
                    },
                  }}
                >
                  <Popup>
                    <p>{store.name}</p>
                    <p>{store.address}</p>
                    <a href={store.direction}>Get Direction</a>
                  </Popup>
                </Marker>
              );
            })}
          {/* Choose Location on Map */}
          {mylocation.lat && mylocation.lng && <Locationmap />}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;
