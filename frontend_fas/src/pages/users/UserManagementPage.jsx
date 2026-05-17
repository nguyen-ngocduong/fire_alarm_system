import { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUserById, deleteUser } from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import useConfirm from '../../hooks/useConfirm';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import UserTable from '../../components/user/UserTable';
import UserFormModal from '../../components/user/UserFormModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ToastContainer } from '../../components/common/Toast';
import authBg from '../../assets/backgrounds/auth-bg.png';

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast, removeToast } = useToast();
  const { isOpen, config, confirm, handleConfirm, handleCancel } = useConfirm();

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast('error', 'Không thể tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = async (user) => {
    const confirmed = await confirm(
      'Xóa người dùng',
      `Bạn có chắc muốn xóa người dùng "${user.username}"? Thao tác này không thể hoàn tác.`
    );

    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      showToast('success', 'Đã xóa người dùng');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('error', 'Không thể xóa người dùng');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await updateUserById(editingUser.id, formData);
        showToast('success', 'Đã cập nhật người dùng');
      } else {
        await createUser(formData);
        showToast('success', 'Đã tạo người dùng mới');
      }
      fetchUsers();
      setShowModal(false);
    } catch (error) {
      throw error; // Let modal handle the error
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog
        isOpen={isOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
      />
      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        initialData={editingUser}
      />

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Icon category="user" name="userGroup" size="xl" alt="Users" className="filter brightness-0 invert" />
            Quản lý người dùng
          </h1>
          <p className="text-gray-400">Quản lý tài khoản và phân quyền người dùng</p>
        </div>
        <Button variant="primary" onClick={handleCreate}>
          + Tạo người dùng mới
        </Button>
      </div>

      {/* Search */}
      <div className="backdrop-blur-md border border-slate-200 rounded-2xl shadow-md p-6" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đăng nhập hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* User table */}
      <div className="backdrop-blur-md border border-slate-200 rounded-2xl shadow-lg p-6" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)' }}>
        <UserTable
          users={filteredUsers}
          currentUserId={currentUser?.id}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;
