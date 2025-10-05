// src/App.tsx (Ejemplo de uso)

import React, { useState, useEffect } from 'react';
import Maps from './components/Maps';
import LoadingScreen from './components/LoadingScreen';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulación de una carga de datos
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000); // Muestra la pantalla de carga por 4 segundos

        return () => clearTimeout(timer);
    }, []);

    // Si está cargando, muestra la pantalla de carga. Si no, muestra la app normal.
    return isLoading ? <LoadingScreen /> : <Maps />;
}

export default App;