import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, signIn } from '../../api/authApi';
import { getUserById } from '../../api/userApi';
import { decodeToken, setTokens } from '../../utils/tokenUtils';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ParticleBackground from '../../components/common/ParticleBackground';
import logo from '../../assets/logo/fire-alarm-logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error khi user nhập
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

    if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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

    setErrors({});
    setIsLoading(true);

    try {
      // Đăng ký
      await register(formData);

      // Tự động đăng nhập
      const { data } = await signIn({
        username: formData.username,
        password: formData.password,
      });
      const { token, refreshToken } = data; // Backend trả về "token" không phải "accessToken"

      // Decode token để lấy userId
      const decoded = decodeToken(token);
      const userId = decoded?.sub;

      if (!userId) {
        throw new Error('Invalid token');
      }

      // LƯU TOKEN TRƯỚC để axiosInstance có thể sử dụng
      setTokens(token, refreshToken);

      // Bây giờ mới lấy thông tin user (axiosInstance sẽ tự động thêm token vào header)
      const userResponse = await getUserById(userId);
      const user = userResponse.data;

      // Lưu vào context
      login(user, token, refreshToken);

      // Redirect về dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      
      // Hiển thị lỗi chi tiết hơn
      if (error.response) {
        // Server responded with error
        const errorMessage = error.response.data?.message || error.response.data?.error;
        
        if (errorMessage?.toLowerCase().includes('username')) {
          setErrors({ username: 'Tên đăng nhập này đã được sử dụng' });
        } else if (errorMessage?.toLowerCase().includes('email')) {
          setErrors({ email: 'Email này đã được đăng ký' });
        } else {
          setErrors({ general: `Lỗi: ${errorMessage || 'Vui lòng thử lại'}` });
        }
      } else if (error.request) {
        // Request was made but no response
        setErrors({ general: 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.' });
      } else {
        // Something else happened
        setErrors({ general: `Lỗi: ${error.message}` });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative bg-bg overflow-hidden">
      <ParticleBackground preset="auth" />
      <div className="w-full max-w-md relative z-10">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Fire Alarm Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-text-primary mb-2">
            Fire Alarm System
          </h1>
          <p className="text-text-secondary font-medium text-lg">Tạo tài khoản mới</p>
        </div>

        <div className="card border-white/5 bg-slate-900/60">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Đăng ký</h2>

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
              placeholder="Nhập tên đăng nhập (tối thiểu 3 ký tự)"
              required
              icon="👤"
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
              icon="📧"
              error={errors.email}
            />

            <Input
              label="Mật khẩu"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
              required
              icon="🔒"
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
