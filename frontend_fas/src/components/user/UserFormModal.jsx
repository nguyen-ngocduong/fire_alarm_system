import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';

const UserFormModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    role: initialData?.role || 'USER',
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
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      
      if (errorMessage?.includes('username')) {
        setErrors({ username: 'Tên đăng nhập này đã được sử dụng' });
      } else if (errorMessage?.includes('email')) {
        setErrors({ email: 'Email này đã được đăng ký' });
      } else {
        setErrors({ general: 'Có lỗi xảy ra. Vui lòng thử lại.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Sửa người dùng' : 'Tạo người dùng mới'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={isLoading}
          >
            {initialData ? 'Cập nhật' : 'Tạo người dùng'}
          </Button>
        </>
      }
    >
      {errors.general && (
        <div className="mb-4 p-3 bg-danger-bg border border-danger rounded-lg">
          <p className="text-sm text-danger">{errors.general}</p>
        </div>
      )}

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

        <div className="mb-4">
          <label className="block text-sm font-medium text-text-primary mb-1">
            Vai trò <span className="text-danger">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        {!initialData && (
          <div className="p-3 bg-primary-light border border-primary rounded-lg">
            <p className="text-sm text-text-secondary">
              💡 Mật khẩu mặc định sẽ là <strong>&quot;password&quot;</strong>. 
              Người dùng nên đổi mật khẩu sau khi đăng nhập lần đầu.
            </p>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default UserFormModal;
