import SensorCard from './SensorCard';
import { getAllSensorTypes, getSensorValue } from '../../utils/sensorUtils';

const SensorGrid = ({ sensorData }) => {
  const sensorTypes = getAllSensorTypes();

  if (!sensorData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorTypes.map((type) => (
          <div key={type} className="card skeleton h-40" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sensorTypes.map((type) => (
        <SensorCard
          key={type}
          sensorType={type}
          value={getSensorValue(sensorData, type)}
        />
      ))}
    </div>
  );
};

export default SensorGrid;
