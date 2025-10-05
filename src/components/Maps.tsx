import React, { useState, useRef } from 'react';
// 💡 Recomendación: usa el nombre original para mayor claridad
import MainLayout from './MainLayout';
import MapPicker, { MapPickerHandle } from "./MapPicker";
import DatePickerModal from './DatePickerModal';

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#1a73e8',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    padding: '8px 12px',
    cursor: 'pointer'
};

const panelStyle: React.CSSProperties = {
    backgroundColor: '#1a2c5a',
    color: 'white',
    padding: 12,
    borderRadius: 8,
    maxWidth: 280
};

const Maps: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ day: number; month: number } | null>(null);
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const mapRef = useRef<MapPickerHandle>(null);

    return (
        <MainLayout title="Análisis Climático">
            <div style={{ color: 'white' }}>
                <h1>Escoger locación y Fecha</h1>
            </div>

            {/* Row: Map left, right column with vertical buttons and coordinates */}
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center' }}>
                {/* Left column: Map */}
                <div style={{ flex: '0 0 auto' }}>
                    <MapPicker ref={mapRef} onMarkerChange={setMarker} />
                </div>

                {/* Right column: Buttons stacked vertically */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, minWidth: 280 }}>
                    <button onClick={() => setOpen(true)} style={buttonStyle}>Seleccionar fecha</button>
                    <button onClick={() => mapRef.current?.locate()} style={buttonStyle}>Usar mi ubicación actual</button>

                    {selected && (
                        <div style={{ color: 'white' }}>
                            {String(selected.day).padStart(2, '0')}/{String(selected.month).padStart(2, '0')}
                        </div>
                    )}

                    {marker && (
                        <div style={panelStyle}>
                            <h3 style={{ marginTop: 0, marginBottom: 8 }}>Coordenadas seleccionadas</h3>
                            <div>Latitud: {marker.lat.toFixed(4)}</div>
                            <div>Longitud: {marker.lng.toFixed(4)}</div>
                        </div>
                    )}
                </div>
            </div>

            <DatePickerModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={(val) => setSelected(val)}
            />
        </MainLayout>
    );
};

export default Maps;