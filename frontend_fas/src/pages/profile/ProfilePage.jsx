import { useState } from 'react';
import { updateUser } from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/common/Toast';
import { formatTimestamp } from '../../utils/dateUtils';
import authBg from '../../assets/backgrounds/auth-bg.png';

const ProfilePage = () => {
  const { user, updateUser: updateAuthUser } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data } = await updateUser(user.id, formData);
      updateAuthUser(data);
      showToast('success', 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage?.includes('username')) {
        setErrors({ username: 'Tên đăng nhập này đã được sử dụng' });
      } else if (errorMessage?.includes('email')) {
        setErrors({ email: 'Email này đã được đăng ký' });
      } else {
        showToast('error', 'Không thể cập nhật thông tin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Icon category="navigation" name="profile" size="xl" alt="Profile" className="filter brightness-0 invert" />
          Hồ sơ cá nhân
        </h1>
        <p className="text-gray-400">Quản lý thông tin tài khoản của bạn</p>
      </div>

      {/* User info card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)' }}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'normal'}>
                {user?.role}
              </Badge>
              {user?.createdAt && (
                <span className="text-sm text-gray-600">
                  Tham gia: {formatTimestamp(user.createdAt, 'dd/MM/yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-1">
              Tên đăng nhập
              <span className="text-danger ml-1">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
              className={`
                w-full px-4 py-2 border rounded-lg bg-white text-gray-900
                ${errors.username ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'}
                focus:outline-none focus:ring-2 focus:ring-offset-0
                transition-colors duration-200
              `}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-danger">{errors.username}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email
              <span className="text-danger ml-1">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập địa chỉ email"
              required
              className={`
                w-full px-4 py-2 border rounded-lg bg-white text-gray-900
                ${errors.email ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'}
                focus:outline-none focus:ring-2 focus:ring-offset-0
                transition-colors duration-200
              `}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-danger">{errors.email}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
            >
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>

      {/* Additional info */}
      <div className="card border-primary" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
        <h3 className="font-semibold text-gray-900 mb-2">💡 Lưu ý</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Tên đăng nhập phải có ít nhất 3 ký tự</li>
          <li>• Email phải là địa chỉ hợp lệ</li>
          <li>• Liên hệ Admin nếu cần thay đổi mật khẩu</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
