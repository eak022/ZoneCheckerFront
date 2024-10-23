import api from "./api";

const VITE_STORE_API = import.meta.env.VITE_STORE_API;

const getAllStores = async () => {
    return await api.get(`${VITE_STORE_API}`);
};

const getStoreById = async (id) => {
    return await api.get(`${VITE_STORE_API}/${id}`);
};

const createStore = async (store) => {
    return await api.post(`${VITE_STORE_API}`, store);
};

const updateStore = async (id, store) => {
    try {
        const response = await api.put(`${VITE_STORE_API}/${id}`, store);
        console.log("Update response data:", response.data); // ตรวจสอบข้อมูลที่ตอบกลับ
        return response; // คืนค่าตอบกลับทั้งหมด
    } catch (error) {
        console.error("Error updating store:", error);
        throw error;
    }
};

const deleteStore = async (id) => {
    try {
        const response = await api.delete(`${VITE_STORE_API}/${id}`);
        if (response.status === 200 || response.status === 204) {
            return response; // Status 200 or 204 means successful deletion
        } else {
            throw new Error(`Failed to delete store. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error deleting store:', error);
        throw error;
    }
};

const StoreService = {
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,
};

export default StoreService;
