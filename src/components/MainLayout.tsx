import React, { ReactNode } from 'react';
import styles from './MainLayout.module.css';
import nasaLogo from '../Assets/Logo_Space.png';
import projectLogo from '../Assets/Logo_app.png';

// Definimos las props que aceptará el componente
interface MainLayoutProps {
    title: string;
    children: ReactNode;
    showCta?: boolean; // controla visibilidad del botón inferior
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children, showCta = true }) => {
    return (
        <div className={styles.layoutContainer}>
            <header className={styles.header}>
                <img src={nasaLogo} alt="NASA Logo" className={styles.logo} />
                <img src={projectLogo} alt="Project Logo" className={styles.logo} />
            </header>
            <h1 className={styles.pageTitle}>{title}</h1>
            <main className={styles.mainContent}>
                <div className={styles.contentArea}>{children}</div>
                {showCta && (
                    <button
                        className={styles.bottomCta}
                        onClick={() => window.open('/factors', '_self')}
                    >
                        Calcular
                    </button>
                )}
            </main>
        </div>
    );
};

export default MainLayout;