import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MOCK_DESTINATIONS, CROWD_LEVELS } from '@/utils/constants';
import { useEffect } from 'react';
import { Star, MapPin, Users, Calendar, Banknote, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;

// Custom Marker generation based on category
const createCustomIcon = (category, crowdLevel) => {
  const crowdColor = CROWD_LEVELS[crowdLevel]?.color || '#2EC4B6';
  
  const iconEmoji = {
    historical: '🏰',
    nature: '🌿',
    adventure: '🏔️',
    beaches: '🌊',
    temples: '🛕',
    culture: '🎭',
  }[category] || '📍';

  const html = `
    <div style="
      background-color: ${crowdColor}; 
      border: 3px solid white;
      width: 36px; 
      height: 36px; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transform: translateY(-50%);
    ">
      ${iconEmoji}
    </div>
    <div style="
      position: absolute;
      bottom: -6px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${crowdColor};
    "></div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44]
  });
};

const createSpecialIcon = (type) => {
  const config = {
    event: { emoji: '🎉', color: '#FF4757' },
    exchange: { emoji: '💱', color: '#2ECC71' }
  }[type];

  const html = `
    <div style="background-color: ${config.color}; border: 2px solid white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transform: translateY(-50%);">
      ${config.emoji}
    </div>
  `;

  return L.divIcon({
    html,
    className: 'special-leaflet-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

const RAJASTHAN_EVENTS = [
  { id: 'ev1', name: 'Pushkar Camel Fair', lat: 26.4897, lng: 74.5511, date: 'Nov 5-13', type: 'Folk & Cattle Fair', description: 'One of the world\'s largest cattle fairs with vibrant cultural performances.' },
  { id: 'ev2', name: 'Jaisalmer Desert Festival', lat: 26.9157, lng: 70.9083, date: 'Feb 22-24', type: 'Cultural', description: 'Experience camel races, turban tying competitions, and folk music in the dunes.' },
  { id: 'ev3', name: 'Udaipur World Music Festival', lat: 24.5854, lng: 73.7125, date: 'Feb 7-9', type: 'Music', description: 'Global music event bringing artists from 20+ countries to the city of lakes.' },
  { id: 'ev4', name: 'Jaipur Literature Festival', lat: 26.9124, lng: 75.7873, date: 'Jan 23-27', type: 'Literature', description: 'The greatest literary show on Earth featuring Nobel laureates and thinkers.' },
  { id: 'ev5', name: 'Marwar Festival', lat: 26.2389, lng: 73.0243, date: 'Oct 12-13', type: 'Folk', description: 'Celebrating the heroes of Rajasthan through music and dance in Jodhpur.' },
  { id: 'ev6', name: 'Bundi Utsav', lat: 25.4415, lng: 75.6355, date: 'Nov 17-19', type: 'Cultural', description: 'Spectacular fireworks, cultural processions and handicraft fairs in Bundi.' },
  { id: 'ev7', name: 'Teej Festival', lat: 26.9200, lng: 75.8200, date: 'Aug 7-8', type: 'Traditional', description: 'A grand swing festival celebrating the monsoon in Jaipur.' },
];

const MONEY_EXCHANGES = [
  { id: 'ex1', name: 'Jaipur International Airport Exchange', lat: 26.8289, lng: 75.8056, hours: '24/7', note: 'Official Thomas Cook & Weizmann Forex counters.' },
  { id: 'ex2', name: 'Clock Tower Exchange, Jodhpur', lat: 26.2947, lng: 73.0229, hours: '9 AM - 8 PM', note: 'Central location near Sardar Market.' },
  { id: 'ex3', name: 'Old City Exchange, Udaipur', lat: 24.5794, lng: 73.6844, hours: '10 AM - 7 PM', note: 'Special rates for foreign tourists near City Palace.' },
  { id: 'ex4', name: 'Fort Gate Exchange, Jaisalmer', lat: 26.9116, lng: 70.9131, hours: '9 AM - 9 PM', note: 'Most reliable exchange inside the Golden Fort area.' },
  { id: 'ex5', name: 'M.I. Road Forex Hub, Jaipur', lat: 26.9150, lng: 75.8100, hours: '10 AM - 6 PM', note: 'Competitive rates, multiple authorized dealers.' },
];

function MapAutoZoom({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, markers]);
  return null;
}

export default function MapView({ destinations = MOCK_DESTINATIONS, height = "600px", embedded = false }) {
  // Center of India roughly
  const defaultCenter = [22.9734, 78.6569];
  const [showEvents, setShowEvents] = useState(false);
  const [showExchange, setShowExchange] = useState(false);

  return (
    <div className={`w-full relative z-0 ${embedded ? '' : 'rounded-card overflow-hidden border border-border shadow-md'}`} style={{ height }}>
      {/* Map Control Panel */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
        <button 
          onClick={() => setShowEvents(!showEvents)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-all ${showEvents ? 'bg-[#FF4757] text-white scale-105' : 'bg-surface/90 text-text hover:bg-surface'}`}
        >
          <Calendar size={14} /> Rajasthan Festivals {showEvents ? 'ON' : 'OFF'}
        </button>
        <button 
          onClick={() => setShowExchange(!showExchange)}
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-all ${showExchange ? 'bg-[#2ECC71] text-white scale-105' : 'bg-surface/90 text-text hover:bg-surface'}`}
        >
          <Banknote size={14} /> Money Exchange {showExchange ? 'ON' : 'OFF'}
        </button>
      </div>

      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        scrollWheelZoom={!embedded}
        className="w-full h-full bg-surface-2"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {/* Destination Markers */}
        {destinations.map(dest => (
          <Marker 
            key={dest.id} 
            position={[dest.lat, dest.lng]}
            icon={createCustomIcon(dest.category, dest.crowdLevel)}
          >
            <Popup className="yatrai-popup">
              <div className="p-1 min-w-[200px]">
                <img src={dest.images?.[0]} alt={dest.name} className="w-full h-24 object-cover rounded-md mb-2" />
                <h3 className="font-heading font-bold text-text text-sm mb-1">{dest.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted mb-2">
                  <MapPin size={10} /> {dest.state}
                </div>
                
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="flex items-center gap-1 text-warning">
                    <Star size={10} className="fill-warning" /> {dest.rating}
                  </span>
                  <span className="flex items-center gap-1" style={{ color: CROWD_LEVELS[dest.crowdLevel]?.color }}>
                    <Users size={10} /> {dest.crowdLevel}
                  </span>
                </div>
                
                <Link 
                  to={`/explore/${dest.id}`}
                  className="block w-full text-center bg-primary text-bg py-1.5 rounded-sm text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Rajasthan Cultural Events Layer */}
        {showEvents && RAJASTHAN_EVENTS.map(ev => (
          <Marker 
            key={ev.id} 
            position={[ev.lat, ev.lng]}
            icon={createSpecialIcon('event')}
          >
            <Popup className="yatrai-popup">
              <div className="p-2 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF4757]/20 flex items-center justify-center text-[#FF4757]">
                    <Calendar size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text leading-tight">{ev.name}</h3>
                    <span className="text-[10px] font-bold text-primary uppercase">{ev.type}</span>
                  </div>
                </div>
                <p className="text-xs text-muted mb-2">{ev.description}</p>
                <div className="p-1.5 rounded bg-surface border border-border flex items-center justify-between">
                  <span className="text-[10px] text-muted uppercase font-bold tracking-wider">Upcoming Date:</span>
                  <span className="text-[10px] font-bold text-[#FF4757]">{ev.date}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Money Exchange Layer */}
        {showExchange && MONEY_EXCHANGES.map(ex => (
          <Marker 
            key={ex.id} 
            position={[ex.lat, ex.lng]}
            icon={createSpecialIcon('exchange')}
          >
            <Popup className="yatrai-popup">
              <div className="p-2 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#2ECC71]/20 flex items-center justify-center text-[#2ECC71]">
                    <Banknote size={16} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-text leading-tight">{ex.name}</h3>
                    <span className="text-[10px] font-bold text-[#2ECC71] uppercase">Foreign Exchange</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="font-bold text-muted">HOURS:</span>
                    <span className="text-text">{ex.hours}</span>
                  </div>
                  <div className="p-1.5 rounded bg-surface-2 italic text-[10px] text-muted">
                    "{ex.note}"
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        <MapAutoZoom markers={[...destinations, ...(showEvents ? RAJASTHAN_EVENTS : []), ...(showExchange ? MONEY_EXCHANGES : [])]} />
      </MapContainer>
    </div>
  );
}
