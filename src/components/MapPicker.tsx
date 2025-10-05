// Nombre de archivo sugerido: MapPicker.tsx
import React, { useState, useCallback } from 'react';
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

// Componente renombrado para consistencia
const MapPicker: React.FC = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""
    });

    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
    // 1. Nuevo estado para el centro del mapa
    const [mapCenter, setMapCenter] = useState(initialCenter);

    const onMapClick = useCallback((e: any) => {
        if (e?.latLng) {
            const newPos = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            };
            setMarker(newPos);
            // 2. Actualizar el centro al hacer clic
            setMapCenter(newPos);
        }
    }, []);

    const useMyLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert('La geolocalización no es soportada por este navegador.');
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const currentPos = { lat: latitude, lng: longitude };
                setMarker(currentPos);
                setMapCenter(currentPos);
            },
            (error) => {
                console.error('Error obteniendo ubicación:', error);
                alert('No se pudo obtener tu ubicación. Revisa los permisos del navegador.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    }, []);

    if (!isLoaded) return <div>Cargando mapa...</div>;

    return (
        <div className={styles.mapContainer}>
            <button className={styles.locateBtn} onClick={useMyLocation}>Usar mi ubicación actual</button>
            <GoogleMap
                mapContainerStyle={containerStyle}
                // 3. Usar el estado del centro en lugar del valor fijo
                center={mapCenter}
                zoom={10} // Puedes ajustar el zoom
                onClick={onMapClick}
            >
                {marker && <Marker position={marker} />}
            </GoogleMap>
            {marker && (
                <div className={styles.coordinates}>
                    <h3>Coordenadas Seleccionadas:</h3>
                    <p>Latitud: {marker.lat.toFixed(4)}</p>
                    <p>Longitud: {marker.lng.toFixed(4)}</p>
                </div>
            )}
        </div>
    );
};

export default MapPicker;