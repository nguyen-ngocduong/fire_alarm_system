import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-text-primary mb-4">
          Trang không tồn tại
        </h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" size="lg">
            🏠 Về trang chủ
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
