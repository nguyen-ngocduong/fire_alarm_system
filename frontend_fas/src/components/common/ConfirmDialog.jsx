import Modal from './Modal';
import Button from './Button';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || 'Xác nhận'}
      size="sm"
      closeOnOverlayClick={false}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Xác nhận
          </Button>
        </>
      }
    >
      <p className="text-text-secondary">{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;
