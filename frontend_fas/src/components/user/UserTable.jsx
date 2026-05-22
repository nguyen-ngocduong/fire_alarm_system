import Button from '../common/Button';
import RoleBadge from './RoleBadge';
import { formatTimestamp } from '../../utils/dateUtils';

const UserTable = ({ users, currentUserId, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        Chưa có người dùng nào
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
              ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
              Tên đăng nhập
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
              Email
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
              Vai trò
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
              Ngày tạo
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-0 hover:bg-white/5">
              <td className="py-3 px-4 text-text-primary">{user.id}</td>
              <td className="py-3 px-4 font-medium text-text-primary">
                {user.username}
                {user.id === currentUserId && (
                  <span className="ml-2 text-xs text-primary">(Bạn)</span>
                )}
              </td>
              <td className="py-3 px-4 text-text-secondary">{user.email}</td>
              <td className="py-3 px-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="py-3 px-4 text-text-secondary text-sm">
                {user.createdAt ? formatTimestamp(user.createdAt, 'dd/MM/yyyy') : '--'}
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEdit(user)}
                >
                  Sửa
                </Button>
                {user.id !== currentUserId && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDelete(user)}
                  >
                    Xóa
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
