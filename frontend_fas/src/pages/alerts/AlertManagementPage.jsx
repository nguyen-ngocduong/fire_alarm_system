import { useState, useEffect, useCallback } from 'react';
import {
  getActiveDevices,
  startListening,
  stopListening,
  resetCooldown,
  sendTestEmail,
} from '../../api/alertApi';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import useToast from '../../hooks/useToast';
import useConfirm from '../../hooks/useConfirm';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ToastContainer } from '../../components/common/Toast';
import { formatCooldownTime } from '../../utils/dateUtils';

const AlertManagementPage = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [testEmail, setTestEmail] = useState('');
  const { toasts, showToast, removeToast } = useToast();
  const { isOpen, config, confirm, handleConfirm, handleCancel } = useConfirm();

  const fetchDevices = useCallback(async () => {
    try {
      const { data } = await getActiveDevices();
      // Backend trả về Map<String, Boolean>, cần chuyển đổi thành array
      const deviceArray = Object.entries(data || {}).map(([deviceId, isListening]) => ({
        deviceId,
        isListening,
        cooldownRemaining: 0, // Backend chưa trả về thông tin cooldown trong API này
      }));
      setDevices(deviceArray);
    } catch (error) {
      console.error('Error fetching devices:', error);
      showToast('error', 'Không thể tải danh sách thiết bị');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDevices();
    // Refresh mỗi 5 giây để cập nhật cooldown
    const interval = setInterval(fetchDevices, 5000);
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const handleStart = async (deviceId) => {
    const confirmed = await confirm(
      'Bắt đầu giám sát',
      `Bạn có chắc muốn bắt đầu giám sát thiết bị ${deviceId}?`
    );

    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [deviceId]: 'start' }));
    try {
      await startListening(deviceId);
      showToast('success', 'Đã bắt đầu giám sát thiết bị');
      fetchDevices();
    } catch (error) {
      console.error('Error starting monitoring:', error);
      showToast('error', 'Không thể bắt đầu giám sát');
    } finally {
      setActionLoading((prev) => ({ ...prev, [deviceId]: null }));
    }
  };

  const handleStop = async (deviceId) => {
    const confirmed = await confirm(
      'Dừng giám sát',
      `Bạn có chắc muốn dừng giám sát thiết bị ${deviceId}?`
    );

    if (!confirmed) return;

    setActionLoading((prev) => ({ ...prev, [deviceId]: 'stop' }));
    try {
      await stopListening(deviceId);
      showToast('success', 'Đã dừng giám sát thiết bị');
      fetchDevices();
    } catch (error) {
      console.error('Error stopping monitoring:', error);
      showToast('error', 'Không thể dừng giám sát');
    } finally {
      setActionLoading((prev) => ({ ...prev, [deviceId]: null }));
    }
  };

  const handleReset = async (deviceId) => {
    setActionLoading((prev) => ({ ...prev, [deviceId]: 'reset' }));
    try {
      await resetCooldown(deviceId);
      showToast('success', 'Đã reset cooldown');
      fetchDevices();
    } catch (error) {
      console.error('Error resetting cooldown:', error);
      showToast('error', 'Không thể reset cooldown');
    } finally {
      setActionLoading((prev) => ({ ...prev, [deviceId]: null }));
    }
  };

  const handleTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      showToast('error', 'Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }

    setActionLoading((prev) => ({ ...prev, testEmail: true }));
    try {
      await sendTestEmail(testEmail);
      showToast('success', `✅ Email test đã được gửi đến ${testEmail}!`);
      setTestEmail('');
    } catch (error) {
      console.error('Error sending test email:', error);
      showToast('error', '❌ Không thể gửi email. Kiểm tra cấu hình SMTP.');
    } finally {
      setActionLoading((prev) => ({ ...prev, testEmail: false }));
    }
  };

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

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Icon category="alert" name="bell" size="xl" alt="Alert" className="filter brightness-0 invert" />
          Quản lý cảnh báo
        </h1>
        <p className="text-gray-400">Giám sát thiết bị và cấu hình email cảnh báo</p>
      </div>

      {/* Section 1: Monitored devices */}
      <div className="card border-white/5 bg-slate-900/60">
        <h2 className="text-xl font-semibold text-white mb-4">Thiết bị đang giám sát</h2>
        
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-lg" />
            ))}
          </div>
        ) : devices.length === 0 ? (
          <p className="text-text-secondary text-center py-8">
            Chưa có thiết bị nào đang được giám sát
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Thiết bị
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Trạng thái
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-text-secondary">
                    Cooldown
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-text-secondary">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.deviceId} className="border-b border-border last:border-0 hover:bg-white/5">
                    <td className="py-3 px-4 font-medium text-text-primary">
                      {device.deviceId}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={device.isListening ? 'safe' : 'normal'}>
                        {device.isListening ? '🟢 Đang giám sát' : '🔴 Đã dừng'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {device.cooldownRemaining > 0 ? (
                        <span className="text-warning font-mono">
                          Còn {formatCooldownTime(device.cooldownRemaining)}
                        </span>
                      ) : (
                        <span className="text-safe">Sẵn sàng gửi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {device.isListening ? (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleStop(device.deviceId)}
                          loading={actionLoading[device.deviceId] === 'stop'}
                        >
                          Dừng
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleStart(device.deviceId)}
                          loading={actionLoading[device.deviceId] === 'start'}
                        >
                          Bắt đầu
                        </Button>
                      )}
                      {device.cooldownRemaining > 0 && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleReset(device.deviceId)}
                          loading={actionLoading[device.deviceId] === 'reset'}
                        >
                          Reset
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 2: Test email */}
      <div className="card border-primary/20 bg-primary-light backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white mb-4">Kiểm tra cấu hình Email</h2>
        <p className="text-text-secondary mb-4">
          Gửi một email test để kiểm tra cấu hình SMTP có hoạt động đúng không.
        </p>
        <div className="flex gap-3 items-start">
          <div className="flex-1">
            <input
              type="email"
              placeholder="Nhập địa chỉ email nhận test..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-white/10 bg-slate-950/40 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTestEmail();
                }
              }}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleTestEmail}
            loading={actionLoading.testEmail}
            disabled={!testEmail}
          >
            📧 Gửi Email Test
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertManagementPage;
