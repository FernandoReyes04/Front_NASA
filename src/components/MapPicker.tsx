// Nombre de archivo sugerido: MapPicker.tsx
import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import styles from './MapPicker.module.css';

const containerStyle = {
    width: '300px',
    height: '300px'
};

const initialCenter = {
    lat: -34.397,
    lng: 150.644
};

export type MapPickerHandle = {
    locate: () => void;
};

type MapPickerProps = {
    onMarkerChange?: (pos: { lat: number; lng: number } | null) => void;
};

// Componente renombrado para consistencia
const MapPicker = forwardRef<MapPickerHandle, MapPickerProps>(({ onMarkerChange }, ref) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
    });

    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    // 1. Nuevo estado para el centro del mapa
    const [mapCenter, setMapCenter] = useState(initialCenter);

    const updateMarker = useCallback((pos: { lat: number; lng: number } | null) => {
        setMarker(pos);
        if (pos) setMapCenter(pos);
        if (onMarkerChange) onMarkerChange(pos);
    }, [onMarkerChange]);

    const onMapClick = useCallback((e: any) => {
        if (e?.latLng) {
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            updateMarker(newPos);
        }
    }, [updateMarker]);

    const useMyLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('La geolocalización no es soportada por este navegador.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentPos = { lat: latitude, lng: longitude };
                updateMarker(currentPos);
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                alert('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, [updateMarker]);

    useImperativeHandle(ref, () => ({ locate: useMyLocation }), [useMyLocation]);

    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <div className={styles.mapContainer}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                // 3. Usar el estado del centro en lugar del valor fijo
                center={mapCenter}
                zoom={10} // Puedes ajustar el zoom
                onClick={onMapClick}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
            {/* Coordenadas removidas de aquí; ahora se muestran en el panel derecho */}
        </div>
    );
});

export default MapPicker;