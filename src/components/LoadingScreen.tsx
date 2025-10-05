// src/components/LoadingScreen.tsx

import React, { useState, useEffect } from 'react';
import MainLayout from './MainLayout';
import styles from './LoadingScreen.module.css';

// 1. Importamos las imágenes desde la carpeta Assets
import cloudIcon from '../Assets/cloud_icon.png';
import rainIcon from '../Assets/rain_icon.png';
import sunIcon from '../Assets/sun_icon.png';

// 2. Creamos un arreglo con las imágenes para poder iterar sobre ellas
const loadingImages = [sunIcon, cloudIcon, rainIcon];

const LoadingScreen: React.FC = () => {
    // 3. Un estado para saber el índice de la imagen actual
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // 4. Un efecto que se ejecuta una vez para iniciar el temporizador
    useEffect(() => {
        // Cambiamos de imagen cada 2 segundos (2000 milisegundos)
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex =>
                // Usamos el módulo (%) para volver al inicio del arreglo (0)
                (prevIndex + 1) % loadingImages.length
            );
        }, 1000);

        // Limpiamos el intervalo cuando el componente se desmonte para evitar fugas de memoria
        return () => clearInterval(intervalId);
    }, []);

    return (
        <MainLayout title="Análisis en Progreso" showCta={false}>
            <div className={styles.loadingContainer}>
                {/* 5. Contenedor para las imágenes que se desvanecen */}
                <div className={styles.imageContainer}>
                    {loadingImages.map((imageSrc, index) => (
                        <img
                            key={index}
                            src={imageSrc}
                            alt="Icono del clima cargando"
                            // Aplicamos la clase 'visible' solo a la imagen activa
                            className={`${styles.loadingImage} ${
                                index === currentImageIndex ? styles.visible : ''
                            }`}
                        />
                    ))}
                </div>
                <h2 className={styles.loadingText}>Procesando datos, por favor espere...</h2>
                <p className={styles.subText}>
                    Estableciendo conexión con los satélites.
                </p>
            </div>
        </MainLayout>
    );
};

export default LoadingScreen;