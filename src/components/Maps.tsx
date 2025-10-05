import React, { useState, useRef } from 'react';
// 💡 Recomendación: usa el nombre original para mayor claridad
import MainLayout from './MainLayout';
import MapPicker, { MapPickerHandle } from "./MapPicker";
import DatePickerModal from './DatePickerModal';

const buttonStyle: React.CSSProperties = {
    backgroundColor: '#0B3D91', // NASA blue
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: '10px 14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(11,61,145,0.35)'
};

const panelStyle: React.CSSProperties = {
    backgroundColor: 'rgba(7,23,63,0.75)',
    color: 'white',
    padding: 12,
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.12)',
    maxWidth: 280,
    boxShadow: '0 6px 18px rgba(0,0,0,0.35)'
};

const Maps: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ day: number; month: number } | null>(null);
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    const mapRef = useRef<MapPickerHandle>(null);

    // Persist selections so Factors page can read them
    React.useEffect(() => {
        if (marker) {
            localStorage.setItem('selection_marker', JSON.stringify(marker));
        }
    }, [marker]);

    React.useEffect(() => {
        if (selected) {
            localStorage.setItem('selection_date', JSON.stringify(selected));
        }
    }, [selected]);

    return (
        <MainLayout title="Análisis Climático">
            <div style={{ color: 'white', textAlign: 'center' }}>
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