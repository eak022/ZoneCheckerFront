import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <header>
        <Navbar />
      </header>
        <main className="flex-1 p-4">
          <Outlet /> {/* This renders the matched child route */}
        </main>
    </div>
  );
};


export default MainLayout;
