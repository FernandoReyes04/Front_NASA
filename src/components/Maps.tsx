import React, { useState } from 'react';
// 💡 Recomendación: usa el nombre original para mayor claridad
import MainLayout from './MainLayout';
import MapPicker from "./MapPicker";
import DatePickerModal from './DatePickerModal';

const Maps: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<{ day: number; month: number } | null>(null);

    return (
        <MainLayout title="Análisis Climático">
            <h1>Escoger locación y Fecha</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <button onClick={() => setOpen(true)} style={{
                    backgroundColor: '#1a73e8', color: '#fff', border: 'none', borderRadius: 6,
                    padding: '8px 12px', cursor: 'pointer'
                }}>Seleccionar fecha</button>
                {selected && (
                    <div style={{ color: 'white' }}>
                        Fecha seleccionada: {String(selected.day).padStart(2, '0')}/{String(selected.month).padStart(2, '0')}
                    </div>
                )}
            </div>
            <MapPicker />
            <DatePickerModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={(val) => setSelected(val)}
            />
        </MainLayout>
    );
};

export default Maps;