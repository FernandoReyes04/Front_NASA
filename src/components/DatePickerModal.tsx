import React, { useEffect, useMemo, useState } from 'react';
import styles from './DatePickerModal.module.css';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (value: { day: number; month: number }) => void;
}

const monthNames = [
    'Enero','Febrero','Marzo','Abril','Mayo','Junio',
    'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
];

function daysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
}

function startWeekday(month: number, year: number): number {
    return new Date(year, month - 1, 1).getDay();
}

const DatePickerModal: React.FC<Props> = ({ open, onClose, onConfirm }) => {
    const today = useMemo(() => new Date(), []);
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    const [viewMonth, setViewMonth] = useState<number>(currentMonth);
    const [selectedDay, setSelectedDay] = useState<number>(currentDay);
    const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (open) {
            setViewMonth(currentMonth);
            setSelectedMonth(currentMonth);
            setSelectedDay(currentDay);
            setError('');
        }
    }, [open, currentMonth, currentDay]);

    const canGoPrev = false;
    const canGoNext = viewMonth < 12;

    const goNext = () => {
        if (!canGoNext) return;
        setViewMonth((m) => Math.min(12, m + 1));
    };

    const totalDays = daysInMonth(viewMonth, currentYear);
    const firstWeekday = startWeekday(viewMonth, currentYear);

    const cells: Array<{ day: number | null; disabled: boolean }>[] = [];
    let week: Array<{ day: number | null; disabled: boolean }> = [];

    for (let i = 0; i < firstWeekday; i++) {
        week.push({ day: null, disabled: true });
    }

    for (let d = 1; d <= totalDays; d++) {
        const isPast = (viewMonth < currentMonth) || (viewMonth === currentMonth && d < currentDay);
        const disabled = isPast;
        week.push({ day: d, disabled });
        if (week.length === 7) {
            cells.push(week);
            week = [];
        }
    }
    if (week.length) {
        while (week.length < 7) week.push({ day: null, disabled: true });
        cells.push(week);
    }

    const handleSelect = (d: number) => {
        if (viewMonth < currentMonth || (viewMonth === currentMonth && d < currentDay)) return;
        setSelectedMonth(viewMonth);
        setSelectedDay(d);
        setError('');
    };

    const handleConfirm = () => {
        if (
            selectedMonth < currentMonth ||
            (selectedMonth === currentMonth && selectedDay < currentDay)
        ) {
            setError('No puedes seleccionar una fecha pasada.');
            return;
        }
        onConfirm({ day: selectedDay, month: selectedMonth });
        onClose();
    };

    const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={styles.overlay} onClick={onOverlayClick} role="dialog" aria-modal="true">
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Seleccionar día y mes</h2>
                    <button className={styles.closeBtn} aria-label="Cerrar" onClick={onClose}>×</button>
                </div>

                <div className={styles.hint}>Solo puedes elegir desde hoy hacia adelante (año actual).</div>

                <div className={styles.calendar}>
                    <div className={styles.calendarHeader}>
                        <button
                            className={`${styles.btn} ${styles.navBtn} ${!canGoPrev ? styles.navBtnDisabled : ''}`}
                            aria-label="Mes anterior"
                            disabled={!canGoPrev}
                        >
                            ‹
                        </button>
                        <div className={styles.calendarTitle}>
                            {monthNames[viewMonth - 1]} {currentYear}
                        </div>
                        <button
                            className={`${styles.btn} ${styles.navBtn}`}
                            aria-label="Mes siguiente"
                            disabled={!canGoNext}
                            onClick={goNext}
                        >
                            ›
                        </button>
                    </div>

                    <div className={styles.weekHeader}>
                        <div>Dom</div>
                        <div>Lun</div>
                        <div>Mar</div>
                        <div>Mié</div>
                        <div>Jue</div>
                        <div>Vie</div>
                        <div>Sáb</div>
                    </div>

                    {cells.map((row, idx) => (
                        <div key={idx} className={styles.weekRow}>
                            {row.map((cell, i) => {
                                const isSelected = cell.day !== null &&
                                    selectedMonth === viewMonth && selectedDay === cell.day;
                                const className = [
                                    styles.dayCell,
                                    cell.disabled ? styles.dayDisabled : '',
                                    isSelected ? styles.daySelected : ''
                                ].join(' ').trim();
                                return (
                                    <button
                                        key={i}
                                        className={className}
                                        disabled={cell.day === null || cell.disabled}
                                        onClick={() => cell.day && handleSelect(cell.day)}
                                        aria-pressed={isSelected}
                                    >
                                        {cell.day ?? ''}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <div className={styles.footer}>
                    <button className={`${styles.btn} ${styles.cancel}`} onClick={onClose}>Cancelar</button>
                    <button className={`${styles.btn} ${styles.confirm}`} onClick={handleConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
