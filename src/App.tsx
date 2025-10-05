// src/App.tsx

import React, { useState, useEffect } from 'react';
import Maps from './components/Maps';
import LoadingScreen from './components/LoadingScreen';

function App() {
    // Enrutamiento ligero sin dependencias: usar pathname
    const path = window.location.pathname;
    const isFactorsRoute = path === '/factors';

    // Cargar solo cuando se entra a "/factors"; no mostrar loading al iniciar en el mapa
    const [isLoadingFactors, setIsLoadingFactors] = useState<boolean>(isFactorsRoute);

    useEffect(() => {
        if (!isFactorsRoute) return; // no activar loading en la vista del mapa
        setIsLoadingFactors(true);
        const timer = setTimeout(() => {
            setIsLoadingFactors(false);
        }, 2000); // duración de la pantalla de carga al entrar a factors
        return () => clearTimeout(timer);
    }, [isFactorsRoute]);

    if (isFactorsRoute) {
        if (isLoadingFactors) return <LoadingScreen />;
        const Factors = require('./components/Factors').default;
        return <Factors />;
    }

    // Ruta por defecto: mapa sin pantalla de carga
    return <Maps />;
}

export default App;