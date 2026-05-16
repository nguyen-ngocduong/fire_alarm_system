const EmptyState = ({ icon = '📭', title, message, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      {message && <p className="text-text-secondary mb-4 max-w-md">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
