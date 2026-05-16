import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../../api/authApi';
import { getUserById } from '../../api/userApi';
import { decodeToken, setTokens } from '../../utils/tokenUtils';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import logo from '../../assets/logo/fire-alarm-logo.png';
import registerSigninBg from '../../assets/backgrounds/register_sigin.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Đăng nhập
      const { data } = await signIn(formData);
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
      console.error('Login error:', error);
      
      // Hiển thị lỗi chi tiết hơn
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error;
        
        if (status === 401) {
          setErrors({ general: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        } else if (status === 404) {
          setErrors({ general: 'Tài khoản không tồn tại' });
        } else {
          setErrors({ general: `Lỗi ${status}: ${message || 'Vui lòng thử lại'}` });
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
    <div className="min-h-screen flex">
      {/* Left side - Branding with background */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark text-white p-12 flex-col justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.8), rgba(153, 27, 27, 0.8)), url(${registerSigninBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-md relative z-10">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-4">
            <img src={logo} alt="Fire Alarm Logo" className="w-20 h-20 object-contain" />
            <div>
              <h1 className="text-4xl font-black">Fire Alarm System</h1>
              <p className="text-primary-light text-sm mt-1">Hệ thống cảnh báo cháy thông minh</p>
            </div>
          </div>
          
          <p className="text-xl text-primary-light mb-8">
            Giám sát và bảo vệ an toàn cho ngôi nhà của bạn
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-blue-500/20 backdrop-blur-sm p-4 rounded-lg border border-blue-400/30">
              <span className="text-4xl">📊</span>
              <div>
                <h3 className="font-semibold mb-1">Giám sát thời gian thực</h3>
                <p className="text-primary-light text-sm">
                  Theo dõi nhiệt độ, khói, khí gas và các chỉ số quan trọng
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-500/20 backdrop-blur-sm p-4 rounded-lg border border-amber-400/30">
              <span className="text-4xl">🔔</span>
              <div>
                <h3 className="font-semibold mb-1">Cảnh báo tức thì</h3>
                <p className="text-primary-light text-sm">
                  Nhận thông báo qua email khi phát hiện nguy hiểm
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-500/20 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
              <span className="text-4xl">📈</span>
              <div>
                <h3 className="font-semibold mb-1">Phân tích lịch sử</h3>
                <p className="text-primary-light text-sm">
                  Xem biểu đồ và thống kê dữ liệu theo thời gian
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src={logo} alt="Fire Alarm Logo" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-3xl font-black text-text-primary mb-2">
              Fire Alarm System
            </h1>
            <p className="text-text-secondary text-sm">Hệ thống cảnh báo cháy thông minh</p>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Đăng nhập</h2>

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
                icon="👤"
                error={errors.username}
              />

              <Input
                label="Mật khẩu"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
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
                Đăng nhập
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Chưa có tài khoản?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
