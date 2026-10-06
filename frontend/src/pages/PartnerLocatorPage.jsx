import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Navigation, AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight, Building, Phone, Mail, Filter } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Markers
const eligibleIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const restrictedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function PartnerLocatorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const schemeIdFromQuery = searchParams.get('scheme_id') || 'nsfdc-sdis';
  const { userProfile } = useApp();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [filterType, setFilterType] = useState('All');

  // Lucknow coordinates default (Rahul Sharma profile)
  const userLat = 26.852;
  const userLon = 80.947;

  useEffect(() => {
    setLoading(true);
    fetch('/api/partners/nearby', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scheme_id: schemeIdFromQuery,
        latitude: userLat,
        longitude: userLon
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPartners(data.partners);
          if (data.partners.length > 0) {
            setSelectedPartner(data.partners[0]);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [schemeIdFromQuery]);

  const filteredPartners = filterType === 'All'
    ? partners
    : partners.filter(p => p.type.toLowerCase() === filterType.toLowerCase() || p.type.includes(filterType));

  const handleRouteApplication = (partner) => {
    navigate(`/application-routing?scheme_id=${schemeIdFromQuery}&partner_id=${partner.partner_id || partner.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-extrabold uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" /> Geo-Spatial Intelligent Router
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Find an Eligible Channel Partner</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Evaluates geographical proximity, fund capacity availability, and NPA/overdue thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Eligible Partners
            </span>
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Restricted (High NPA)
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'SCA', 'Bank', 'NBFC-MFI'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type === 'All' ? 'All Partner Types' : type}
            </button>
          ))}
        </div>

        {/* Main Map + Sidebar Grid with Equal Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Interactive Leaflet Map Box */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-3 shadow-sm border border-slate-200/80 h-[550px] relative overflow-hidden">
            <MapContainer
              center={[userLat, userLon]}
              zoom={11}
              scrollWheelZoom={false}
              className="w-full h-full rounded-2xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User location marker */}
              <Marker position={[userLat, userLon]} icon={userIcon}>
                <Popup>
                  <div className="text-xs font-bold p-1">
                    📍 Rahul Sharma (Your Location)
                    <span className="block text-[10px] text-slate-500 font-normal">Lucknow, UP</span>
                  </div>
                </Popup>
              </Marker>

              {/* Partners markers */}
              {filteredPartners.map(partner => (
                <Marker
                  key={partner.partner_id || partner.id}
                  position={[partner.latitude, partner.longitude]}
                  icon={partner.routing_status === 'Eligible' ? eligibleIcon : restrictedIcon}
                  eventHandlers={{
                    click: () => setSelectedPartner(partner)
                  }}
                >
                  <Popup>
                    <div className="space-y-1 p-1 text-xs">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        partner.routing_status === 'Eligible' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {partner.routing_status}
                      </span>
                      <h4 className="font-extrabold text-slate-900">{partner.name}</h4>
                      <p className="text-[10px] text-slate-500">{partner.distance_km} km away • {partner.type}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Partner Cards Sidebar with Matching Height */}
          <div className="lg:col-span-5 space-y-4 h-[550px] overflow-y-auto pr-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Discovered Channel Partners ({filteredPartners.length})
            </span>

            {filteredPartners.map(partner => {
              const isEligible = partner.routing_status === 'Eligible';
              const isSelected = selectedPartner && (selectedPartner.partner_id || selectedPartner.id) === (partner.partner_id || partner.id);
              
              return (
                <div
                  key={partner.partner_id || partner.id}
                  onClick={() => setSelectedPartner(partner)}
                  className={`bg-white rounded-3xl p-5 border shadow-sm space-y-3 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-200">
                            {partner.type}
                          </span>
                          <span className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                            <Navigation className="w-3 h-3" /> {partner.distance_km} km away
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{partner.name}</h3>
                      </div>

                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border shrink-0 ${
                        isEligible 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}>
                        {isEligible ? '🟢 Eligible' : '🔴 Restricted'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-snug">{partner.address}</p>

                    {/* Operational Status Badges */}
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Fund Utilization</span>
                        <span className="font-bold text-slate-800">{partner.fund_utilization_percentage}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">NPA / Overdue Status</span>
                        <span className={`font-bold ${partner.overdue_percentage > 10 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {partner.npa_status} ({partner.overdue_percentage}%)
                        </span>
                      </div>
                    </div>

                    {/* Restriction Explanation */}
                    {!isEligible && (
                      <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-[11px] text-red-900 flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <span><strong>Not currently eligible:</strong> {partner.restriction_reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Route Action Button */}
                  {isEligible ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteApplication(partner);
                      }}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer mt-2"
                    >
                      Route Application Here →
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-200 text-slate-500 font-bold rounded-xl text-xs opacity-60 cursor-not-allowed mt-2"
                    >
                      Routing Restricted
                    </button>
                  )}

                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
