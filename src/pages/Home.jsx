import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/auth.context'; // นำเข้า useAuthContext

const Home = () => {
    const { user } = useAuthContext(); // ใช้ useAuthContext เพื่อตรวจสอบสถานะการล็อกอิน
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // ถ้ามีผู้ใช้ล็อกอินแล้ว ให้เปลี่ยนเส้นทางไปยังหน้าแดชบอร์ด
            navigate('/dashbord');
        }
    }, [user, navigate]);

    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage:
                    "url(https://plus.unsplash.com/premium_photo-1661311943117-c515634ea81d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFwfGVufDB8fDB8fHww)",
            }}
        >
            <div className="hero-overlay bg-opacity-70 bg-black"></div>
            <div className="hero-content text-neutral-content text-center">
                <div className="max-w-md">
                    <h1 className="mb-5 text-6xl font-extrabold text-white drop-shadow-md tracking-wide">
                    Zone Checker
                    </h1>
                    <p className="mb-5 text-lg text-gray-300 drop-shadow-sm">
                    Track your zones like never before with ZoneChecker! Effortlessly manage, monitor, and optimize your zones in real time. Experience peace of mind with our intuitive platform, designed for accuracy and efficiency.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg px-8 py-4 font-semibold rounded-full shadow-lg transition transform hover:scale-105 hover:bg-blue-600">
                        Start 
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;