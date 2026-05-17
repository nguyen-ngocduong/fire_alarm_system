import axiosInstance from './axiosInstance';

/**
 * Lấy danh sách tất cả người dùng (Admin only)
 */
export const getAllUsers = () => {
  return axiosInstance.get('/users/get/allUser');
};

/**
 * Lấy thông tin người dùng theo ID
 * @param {number} id 
 */
export const getUserById = (id) => {
  return axiosInstance.get(`/users/get/user/${id}`);
};

/**
 * Tạo người dùng mới (Admin only)
 * @param {object} data - { username, email, role }
 */
export const createUser = (data) => {
  return axiosInstance.post('/users/create_user', data);
};

/**
 * Cập nhật thông tin người dùng hiện tại (profile của chính mình)
 * @param {object} data - { username, email }
 */
export const updateUser = (data) => {
  return axiosInstance.put('/users/update/profile', data);
};

/**
 * Cập nhật thông tin bất kỳ người dùng nào (Admin only)
 * @param {number} id 
 * @param {object} data - { username, email, role }
 */
export const updateUserById = (id, data) => {
  return axiosInstance.put(`/users/update/user/${id}`, data);
};

/**
 * Xóa người dùng (Admin only)
 * @param {number} id 
 */
export const deleteUser = (id) => {
  return axiosInstance.delete(`/users/delete/user/${id}`);
};
