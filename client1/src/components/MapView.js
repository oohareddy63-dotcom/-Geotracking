import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapView = ({ employees = [], tasks = [], center = [12.9716, 77.5946], zoom = 13 }) => {
  // Create custom icons for different employee statuses
  const createEmployeeIcon = (status) => {
    const color = status === 'active' ? '#4caf50' : '#f44336';
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="5" fill="white"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  const createTaskIcon = () => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.596 19.404 0 12.5 0z" fill="#2196f3"/>
          <path d="M8 12h9v2H8v-2zm0 3h9v2H8v-2z" fill="white"/>
        </svg>
      `)}`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Employee Markers */}
        {employees.map((employee) => (
          <Marker
            key={employee._id}
            position={[employee.checkInLocation?.latitude || 0, employee.checkInLocation?.longitude || 0]}
            icon={createEmployeeIcon(employee.status)}
          >
            <Popup>
              <div>
                <h4>{employee.employeeId?.name}</h4>
                <p>Status: {employee.status === 'active' ? 'Active' : 'Inactive'}</p>
                <p>Check-in: {new Date(employee.checkInTime).toLocaleString()}</p>
                {employee.totalHours && <p>Hours: {employee.totalHours.toFixed(2)}</p>}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Task Markers with Geo-Fences */}
        {tasks.map((task) => (
          <React.Fragment key={task._id}>
            <Marker
              position={[task.location?.latitude || 0, task.location?.longitude || 0]}
              icon={createTaskIcon()}
            >
              <Popup>
                <div>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <p>Assigned to: {task.assignedTo?.name}</p>
                  <p>Status: {task.status}</p>
                  <p>Progress: {task.completionPercentage}%</p>
                  <p>Geo-Fence: {task.geoFenceRadius}m radius</p>
                </div>
              </Popup>
            </Marker>

            {/* Geo-Fence Circle */}
            <Circle
              center={[task.location?.latitude || 0, task.location?.longitude || 0]}
              radius={task.geoFenceRadius}
              pathOptions={{
                color: '#2196f3',
                fillColor: '#2196f3',
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
