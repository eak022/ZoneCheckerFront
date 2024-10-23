import { createContext, useContext, useState, useEffect } from 'react';
import StoreService  from '../services/store.service';
import { useAuthContext } from './auth.context';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const { user } = useAuthContext(); // ใช้ AuthContext แทน Clerk

  const fetchStore = async (id) => {
    try {
      const response = await StoreService.getStoreById(id); // ค้นหาข้อมูลตาม ID
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  };

  const fetchAllStores = async () => {
    if (!user) return;
    try {
      const response = await StoreService.getAllStores();
      if (response.status === 200) {
        setStores(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllStores();
  }, [user]);


  const addStore = async (store) => {
    try {
      const response = await StoreService.createStore(store);
      if (response.status === 200) {
        setStores((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateStore = async (id, newStore) => {
    try {
      const response = await StoreService.updateStore(id, newStore);
      console.log("Update Store response:", response.data); // ตรวจสอบข้อมูลที่ตอบกลับ
      if (response.status === 200) {
        setStores((prev) =>
          prev.map((store) =>
            store.id === id ? { ...store, ...response.data } : store
          )
        );
        return response; // คืนค่าตอบกลับ
      }
    } catch (error) {
      console.log("Error updating Store:", error);
      throw error; // ข้อผิดพลาดจะถูกจัดการใน EditStore
    }
  };
  const deleteStore = async (id) => {
  try {
    const response = await StoreService.deleteStore(id);
    if (response.status === 200 || response.status === 204) {
      // อัปเดต state ทันที
      setStores((prev) => prev.filter((store) => store.id !== id));
      // อัปเดต filteredStores
      setFilteredStores((prev) => prev.filter((store) => store.id !== id));
    }
  } catch (error) {
    console.log("Error deleting Store:", error);
  }
};

  
  

  return (
    <StoreContext.Provider
      value={{ stores, fetchStore, addStore, updateStore, deleteStore, fetchAllStores }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => useContext(StoreContext);