import { useEffect, useState } from "react";  
import { MapContainer, TileLayer, Marker, Popup, useMapEvent, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import Swal from "sweetalert2";
import "../../App.css";
import { useStoreContext } from "../../contexts/store.contsxt"; // แก้ไขชื่อไฟล์ที่นำเข้า
import { useAuthContext } from "../../contexts/auth.context"; // Import the auth context
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate เพื่อนำทางไปหน้าแก้ไข

const Dashbord = () => {
    const center = [13.838487865712025, 100.02534086066446]; // SE NPRU
    const { stores, fetchAllStores, deleteStore } = useStoreContext(); // เพิ่ม deleteStore ที่นี่
    const { user } = useAuthContext(); // Use user data from AuthContext
    const [mylocation, setMylocation] = useState({ lat: null, lng: null });
    const [deliveryZone, setDeliveryZone] = useState({
        lat: null,
        lng: null,
        radius: 700,
    });
    const [selectedStore, setSelectedStore] = useState(null); // สถานะร้านค้าที่เลือก
    const navigate = useNavigate(); // To navigate for edit


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
    }, [user]); // Added user as a dependency

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
    const adminStoreIcon = new Icon({
        iconUrl: "https://img.icons8.com/?size=100&id=chS9utjiN2xq&format=png&color=000000", // เปลี่ยน URL ตามที่คุณต้องการ
        iconSize: [25, 26],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
    });

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
            const newLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setMylocation(newLocation);
            console.log("Current Location set to:", newLocation); // เพิ่มบรรทัดนี้เพื่อ log ตำแหน่ง
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

    const handleEdit = (storeId) => {
        navigate(`/editstore/${storeId}`); // นำทางไปยังหน้าแก้ไข
    };

    const handleDelete = (storeId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteStore(storeId); // เรียกใช้ deleteStore จาก StoreContext
                    Swal.fire("Deleted!", "Your store has been deleted.", "success");
                } catch (error) {
                    console.error(error); // เพิ่มบรรทัดนี้เพื่อดูรายละเอียดข้อผิดพลาด
                    Swal.fire("Error!", "There was an error deleting the store.", "error");
                }
            }
        });
    };


    const handleAdd = () => {
        navigate('/addstore'); // นำทางไปหน้าเพิ่มร้านค้า
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
                {/* แสดงปุ่มเพิ่มร้านค้าเฉพาะสำหรับผู้ใช้ที่เป็นแอดมิน */}
                {user && user.roles && user.roles.includes("ROLE_ADMIN") && ( // ตรวจสอบว่า user เป็นแอดมินหรือไม่
                    <button
                        onClick={handleAdd}
                        className="bg-purple-500 text-white font-semibold py-2 px-4 rounded shadow hover:bg-purple-600 transition duration-200"
                    >
                        Add Store
                    </button>
                )}
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
                        icon={
                            user && user.id === store.adminId 
                            ? adminStoreIcon 
                            : (selectedStore === store.id ? selectedIcon : defaultIcon)
                        }
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
                    
                            {/* ปุ่มแก้ไขและลบเฉพาะ admin ของร้าน */}
                            {user && user.id === store.adminId && (
                                <>
                                    <button className="btn btn-primary" onClick={() => handleEdit(store.id)}>Edit</button>
                                    <button className="btn btn-error" onClick={() => handleDelete(store.id)}>Delete</button>
                                </>
                            )}
                        </Popup>
                    </Marker>
                ))}
                
                {/* เพิ่ม Marker สำหรับตำแหน่งปัจจุบันของผู้ใช้ */}
                {mylocation.lat && mylocation.lng && (
                    <Marker position={[mylocation.lat, mylocation.lng]} icon={myLocationIcon}>
                        <Popup>Your Location</Popup>
                    </Marker>
                )}
                {/* แสดง Circle สำหรับ deliveryZone */}
                {deliveryZone.lat && deliveryZone.lng && (
                    <Circle
                        center={[deliveryZone.lat, deliveryZone.lng]}
                        radius={deliveryZone.radius}
                        pathOptions={{ fillColor: "blue" }}
                    />
                )}
            </MapContainer>
        </div>
    );
    
};

export default Dashbord;
