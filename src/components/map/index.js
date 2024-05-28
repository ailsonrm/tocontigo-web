import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Adicione o ícone padrão do Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

// const lawyerData = [
//   { lat: -23.463658, lng: -46.5469013, count: 150 }, // Exemplo de São Paulo
//   { lat: -23.4593908, lng: -46.5201666, count: 100 } // Exemplo do Rio de Janeiro
//   // Adicione mais dados conforme necessário
// ];

const MapWithDensity = ({ lawyerData }) => {
  console.log('lawyerData', lawyerData);
  return (
    <MapContainer
      center={[-23.4622364, -46.5273521]}
      zoom={12}
      style={{ height: '50vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {lawyerData.map((location, index) => (
        <Marker key={index} position={[location.lat, location.lng]}>
          <Popup>
            <div>
              <h2>Densidade</h2>
              <p>{location.count} advogados</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapWithDensity;
