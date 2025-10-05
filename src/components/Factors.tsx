import React, { useEffect, useMemo, useRef, useState } from 'react';
import MainLayout from './MainLayout';
import styles from './Factors.module.css';
import { postAnalyze, AnalyzeRequest } from '../api/analyze';
import { z } from 'zod';
import LoadingScreen from './LoadingScreen';

// Utils
function normalizeLongitude(lon: number): number {
  let x = lon % 360;
  if (x < -180) x += 360;
  if (x >= 180) x -= 360;
  return x;
}

function daysInMonth(month: number): number {
  // evaluate for a non-leap reference year 2025 for simplicity when only month/day are provided
  return new Date(2025, month, 0).getDate();
}

const nf0 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 });
const nf3 = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 3 });

const uiFactors = [
  { label: 'Precipitación', value: 'precipitation' as const },
  { label: 'Temperatura', value: 'temperature' as const },
  { label: 'Humedad', value: 'humidity' as const },
  { label: 'Viento', value: 'wind' as const },
  { label: 'Confort', value: 'comfort' as const },
];

// Zod schema
const FormSchema = z.object({
  latitude: z.number({ invalid_type_error: 'Latitud inválida' }).min(-90).max(90),
  longitude: z.number({ invalid_type_error: 'Longitud inválida' }), // will be normalized
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  factor: z.enum(['precipitation','temperature','humidity','wind','comfort']),
}).refine((v) => v.day >= 1 && v.day <= daysInMonth(v.month), {
  path: ['day'],
  message: 'Día no válido para el mes seleccionado',
});

type UiFactor = z.infer<typeof FormSchema>['factor'];

const Factors: React.FC = () => {
  // Read selections from localStorage saved by Maps
  const initialMarker = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('selection_marker') || 'null'); } catch { return null; }
  }, []);
  const initialDate = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('selection_date') || 'null'); } catch { return null; }
  }, []);

  const [latitude, setLatitude] = useState<number | ''>(initialMarker?.lat ?? '');
  const [longitude, setLongitude] = useState<number | ''>(initialMarker?.lng ?? '');
  const [month, setMonth] = useState<number | ''>(initialDate?.month ?? '');
  const [day, setDay] = useState<number | ''>(initialDate?.day ?? '');
  const [factor, setFactor] = useState<UiFactor>('precipitation');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [toast, setToast] = useState<string | null>(null);
  const autoRunOnce = useRef(false);

  // Build parsed/validated form value
  const parsed = (() => {
    try {
      const normLon = typeof longitude === 'number' ? normalizeLongitude(longitude) : NaN;
      const data = FormSchema.parse({
        latitude: typeof latitude === 'number' ? latitude : NaN,
        longitude: normLon,
        month: typeof month === 'number' ? month : NaN,
        day: typeof day === 'number' ? day : NaN,
        factor,
      });
      // additionally ensure normalized lon is within range
      if (data.longitude < -180 || data.longitude >= 180) return { success: false as const };
      return { success: true as const, data };
    } catch {
      return { success: false as const };
    }
  })();

  const canSubmit = parsed.success && !loading;

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setResult(null);
    if (!parsed.success) return;

    // Map UI factor to API factor list (only one)
    // Cargar todas las métricas a la vez (en una sola petición con todos los factores)
    const factorsAll: AnalyzeRequest['factors'] = ['temperature','precipitation','windspeed','humidity','comfort'];

    const body: AnalyzeRequest = {
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      month: parsed.data.month,
      day: parsed.data.day,
      start_year: 2000,
      end_year: 2024,
      half_window_days: 0,
      factors: factorsAll,
    };

    try {
      setLoading(true);
      const data = await postAnalyze(body);
      if (!data?.ok) {
        throw new Error(data?.message || 'Solicitud rechazada');
      }
      setResult(data);
    } catch (err: any) {
      setToast(err?.message || 'Error al conectar con el servicio');
      // auto-hide
      setTimeout(() => setToast(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Auto-ejecutar una vez si ya hay datos válidos al entrar (desde mapa)
  useEffect(() => {
    if (autoRunOnce.current) return;
    if (parsed.success && latitude !== '' && longitude !== '' && month !== '' && day !== '') {
      autoRunOnce.current = true;
      onSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render helpers for results
  const renderResults = () => {
    if (!result?.results) return null;
    const r = result.results;
    // Map both wind keys
    const windRes = r.wind || r.windspeed;

    const rows: Array<{ label: string; value: string } > = [];
    switch (factor) {
      case 'precipitation': {
        const wet = r?.precipitation?.prob_wet_day;
        const p50 = r?.precipitation?.intensity_percentiles?.p50;
        if (wet != null) rows.push({ label: 'Probabilidad de lluvia', value: `${(wet * 100).toFixed(0)} %` });
        if (p50 != null) rows.push({ label: 'Intensidad típica', value: `${p50} mm/día` });
        break;
      }
      case 'temperature': {
        const typical = r?.temperature?.typical;
        const p10 = r?.temperature?.percentiles?.p10;
        const p90 = r?.temperature?.percentiles?.p90;
        const label = r?.temperature?.label;
        if (typical != null) rows.push({ label: 'Temperatura típica', value: `${typical} °C` });
        if (p10 != null && p90 != null) rows.push({ label: 'Rango típico', value: `${p10} – ${p90} °C` });
        if (label) rows.push({ label: 'Condición', value: String(label) });
        break;
      }
      case 'humidity': {
        const typical = r?.humidity?.typical;
        const p10 = r?.humidity?.percentiles?.p10;
        const p90 = r?.humidity?.percentiles?.p90;
        if (typical != null) rows.push({ label: 'Humedad típica', value: `${typical} %` });
        if (p10 != null && p90 != null) rows.push({ label: 'Rango típico', value: `${p10} – ${p90} %` });
        break;
      }
      case 'wind': {
        const typical = windRes?.typical;
        if (typical != null) rows.push({ label: 'Viento típico 10 m', value: `${typical} m/s` });
        break;
      }
      case 'comfort': {
        const label = r?.comfort?.label;
        const typical = r?.comfort?.typical;
        if (label) rows.push({ label: 'Confort', value: String(label) });
        if (typical != null) rows.push({ label: 'Valor típico', value: String(typical) });
        break;
      }
    }

    return (
      <div className={styles.card} style={{ background: 'rgba(255,255,255,0.08)', color: 'white' }}>
        {rows.slice(0, 4).map((row, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0' }}>
            <span style={{ opacity: 0.85 }}>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          Basado en climatología 2000–2024 para ±5 días.
        </div>
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.7 }}>
          Probabilidad climatológica. No es pronóstico.
        </div>
      </div>
    );
  };

  // Mostrar pantalla de carga a pantalla completa cuando esté cargando (para cualquier factor)
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <MainLayout title="Factores" showCta={false}>
      <div className={styles.container}>
        <div className={styles.column}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>Parámetros de análisis</h1>

            <form onSubmit={onSubmit} className={styles.cardsContainer}>
              <div className={styles.card}>
                <label>
                  Latitud
                  <input
                    type="number"
                    step="any"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="-90 a 90"
                  />
                </label>
                <label>
                  Longitud
                  <input
                    type="number"
                    step="any"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="cualquier valor, se normaliza"
                  />
                </label>
              </div>

              <div className={styles.card}>
                <label>
                  Mes
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value === '' ? '' : Number(e.target.value))}
                    min={1}
                    max={12}
                    placeholder="1-12"
                  />
                </label>
                <label>
                  Día
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => setDay(e.target.value === '' ? '' : Number(e.target.value))}
                    min={1}
                    max={31}
                    placeholder="1-31"
                  />
                </label>
              </div>

              <div className={styles.card}>
                <strong>Factor</strong>
                <div className={styles.radioGroup}>
                  {uiFactors.map((f) => (
                    <label key={f.value} className={styles.radioOption}>
                      <input
                        type="radio"
                        name="factor"
                        checked={factor === f.value}
                        onChange={() => setFactor(f.value)}
                      />
                      {f.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ width: '100%' }}>
                <button className={styles.card} type="submit" disabled={!canSubmit}>
                  {loading ? 'Calculando…' : 'Calcular'}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className={styles.divider} />
        <div className={`${styles.column} ${styles.rightColumn}`}>
          <h1 className={styles.title}>Resultados</h1>
          {loading && <div style={{ color: 'white' }}>Procesando…</div>}
          {!loading && !result && <div style={{ color: 'white' }}>Completa el formulario y presiona Calcular.</div>}
          {!loading && result && renderResults()}
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', right: 16, bottom: 16, background: '#ff4d4f', color: 'white', padding: '10px 14px', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>
          {toast}
        </div>
      )}
    </MainLayout>
  );
};

export default Factors;
