import Badge from '../common/Badge';

const RoleBadge = ({ role }) => {
  const variant = role === 'ADMIN' ? 'primary' : 'normal';
  
  return (
    <Badge variant={variant}>
      {role}
    </Badge>
  );
};

export default RoleBadge;
