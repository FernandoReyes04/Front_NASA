import React, { ReactNode } from 'react';
import styles from './MainLayout.module.css';
import nasaLogo from '../Assets/Logo_Space.png';
import projectLogo from '../Assets/Logo_app.jpg';

// Definimos las props que aceptará el componente
interface MainLayoutProps {
    title: string;
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ title, children }) => {
    return (
        <div className={styles.layoutContainer}>
            <header className={styles.header}>
                <img src={nasaLogo} alt="NASA Logo" className={styles.logo} />
                <img src={projectLogo} alt="Project Logo" className={styles.logo} />
            </header>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default MainLayout;