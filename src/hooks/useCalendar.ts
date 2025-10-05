import { useMemo } from 'react';

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

export const useCalendar = (viewMonth: number, year: number) => {
    const calendarData = useMemo(() => {
        const totalDays = daysInMonth(viewMonth, year);
        const firstWeekday = startWeekday(viewMonth, year);

        const cells: (number | null)[] = [];

        // Rellenar huecos antes del día 1
        for (let i = 0; i < firstWeekday; i++) {
            cells.push(null);
        }

        // Añadir los días del mes
        for (let d = 1; d <= totalDays; d++) {
            cells.push(d);
        }

        // Rellenar huecos al final para completar la última semana
        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        return {
            monthName: monthNames[viewMonth - 1],
            calendarCells: cells,
        };
    }, [viewMonth, year]);

    return calendarData;
};