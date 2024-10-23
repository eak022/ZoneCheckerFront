import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import Swal from "sweetalert2";
import "../../App.css";
import { useStoreContext } from "../../contexts/store.contsxt"; // Import the store context
import { useAuthContext } from "../../contexts/auth.context"; // Import the auth context

const Dashbord = () => {
    const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
    const { stores, fetchAllStores } = useStoreContext(); // Use stores and fetchAllStores from StoreContext
    const { user } = useAuthContext(); // Use user data from AuthContext
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
            if (user) {
                await fetchAllStores(); // Fetch stores when user is logged in
            }
        };
        fetchStores();
    }, [user, fetchAllStores]);

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
                <Popup>Your Location. <br /> Customize as needed.</Popup>
            </Marker>
        );
    };

    // ไอคอนต่างๆ
    const defaultIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=21242&format=png&color=000000",
        iconSize: [25, 26],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const selectedIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=21240&format=png&color=000000",
        iconSize: [25, 26],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

    const myLocationIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=wFfu6zXx15Yk&format=png&color=000000",
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

        // ตรวจสอบว่า deliveryZone ถูกตั้งค่า
        if (!deliveryZone.lat || !deliveryZone.lng) {
            Swal.fire({
                title: "Error",
                text: "Delivery zone is not set. Please select a store first.",
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
        <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-4"> {/* แถวของปุ่ม */}
                <button
                    onClick={handleGetLocation}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-blue-600 transition duration-200"
                >
                    Get My Location
                </button>
                <button
                    onClick={handleLocationCheck}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-green-600 transition duration-200"
                >
                    Check Delivery Zone
                </button>
            </div>
            <MapContainer center={center} zoom={13} style={{ height: "80vh", width: "100%" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mylocation.lat && mylocation.lng && <Locationmap />}
                {stores.map((store) => (
                    <Marker
                        position={[store.latitude, store.longitude]}
                        key={store.id}
                        icon={selectedStore === store.id ? selectedIcon : defaultIcon}
                        eventHandlers={{
                            click: () => {
                                setDeliveryZone({
                                    lat: store.latitude,
                                    lng: store.longitude,
                                    radius: 700, // รัศมีการส่ง
                                });
                                setSelectedStore(store.id);
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
                            <p>Admin: {store.adminName}</p> {/* แสดงชื่อ admin ของร้าน */}
                            <a href={store.direction}>Get Direction</a>
                            {/* ปุ่มแก้ไขและลบเฉพาะ admin ของร้าน */}
                            {user.role === 'admin' && selectedStore === store.id && (
                                <>
                                    <button className="text-blue-500" onClick={() => handleEdit(store.id)}>Edit</button>
                                    <button className="text-red-500" onClick={() => handleDelete(store.id)}>Delete</button>
                                </>
                            )}
                        </Popup>
                    </Marker>
                ))}
                {/* แสดง Circle สำหรับ deliveryZone */}
                {deliveryZone.lat && deliveryZone.lng && (
                    <Circle
                        center={[deliveryZone.lat, deliveryZone.lng]}
                        radius={deliveryZone.radius} // รัศมีการส่ง
                        pathOptions={{ color: 'blue', opacity: 0.5 }} // สีและความโปร่งใสของวงกลม
                    />
                )}
                {/* ปุ่มแอดที่เห็นเฉพาะ admin */}
                {user.role === 'admin' && (
                    <button
                        onClick={handleAdd}
                        className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-yellow-600 transition duration-200 mt-4"
                    >
                        Add Store
                    </button>
                )}
            </MapContainer>
        </div>
    );
    
};

export default Dashbord;
