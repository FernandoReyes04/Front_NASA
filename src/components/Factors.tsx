import React, { useEffect, useState } from 'react';
import MainLayout from './MainLayout';
import styles from './Factors.module.css';

const Factors: React.FC = () => {
  const factors = [
    'Temperatura',
    'Preciítación',
    'Viento',
    'Humedad',
    'Confort',
  ];

  const [openFactor, setOpenFactor] = useState<string | null>(null);
  const [animIn, setAnimIn] = useState(false);

  useEffect(() => {
    if (openFactor) {
      setAnimIn(false);
      const r = requestAnimationFrame(() => setAnimIn(true));
      return () => cancelAnimationFrame(r);
    } else {
      setAnimIn(false);
    }
  }, [openFactor]);

  const modalAnimatedStyle: React.CSSProperties = {
    opacity: animIn ? 1 : 0,
    transform: animIn ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)'
  };

  return (
    <MainLayout title="Factores" showCta={false}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>Factores</h1>
            <div className={styles.cardsContainer}>
              {factors.map((f) => (
                <div
                  key={f}
                  className={styles.card}
                  role="button"
                  tabIndex={0}
                  onClick={() => setOpenFactor(f)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpenFactor(f); }}
                >
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={styles.column}>
          <h1 className={styles.title}>Resultados</h1>
        </div>
      </div>

      {openFactor && (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) setOpenFactor(null); }}>
          <div
            className={styles.modalBox}
            style={modalAnimatedStyle}
            role="dialog"
            aria-modal="true"
            aria-label={`Información de ${openFactor}`}
          >
            <h2 className={styles.modalTitle}>{openFactor}</h2>
            <p>Próximamente pondré la información.</p>
            <button className={styles.closeBtn} onClick={() => setOpenFactor(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Factors;
