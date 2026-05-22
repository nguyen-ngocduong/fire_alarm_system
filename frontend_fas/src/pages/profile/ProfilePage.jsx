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
      const { data } = await updateUser(formData);
      updateAuthUser(data);
      showToast('success', 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || error.message || '';
      
      if (errorMessage.toLowerCase().includes('username')) {
        setErrors({ username: 'Tên đăng nhập này đã được sử dụng bởi người khác' });
        showToast('error', 'Tên đăng nhập đã tồn tại');
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ email: 'Email này đã được đăng ký bởi người khác' });
        showToast('error', 'Email đã tồn tại');
      } else {
        showToast('error', 'Không thể cập nhật thông tin. Vui lòng thử lại!');
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
      <div className="card border-white/5 bg-slate-900/60">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user?.role === 'ADMIN' ? 'primary' : 'normal'}>
                {user?.role}
              </Badge>
              {user?.createdAt && (
                <span className="text-sm text-text-secondary">
                  Tham gia: {formatTimestamp(user.createdAt, 'dd/MM/yyyy')}
                </span>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Tên đăng nhập"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Nhập tên đăng nhập"
            required
            error={errors.username}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Nhập địa chỉ email"
            required
            error={errors.email}
          />

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
      <div className="card border-primary/20 bg-primary-light backdrop-blur-md">
        <h3 className="font-semibold text-white mb-2">💡 Lưu ý</h3>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Tên đăng nhập phải có ít nhất 3 ký tự</li>
          <li>• Email phải là địa chỉ hợp lệ</li>
          <li>• Liên hệ Admin nếu cần thay đổi mật khẩu</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
