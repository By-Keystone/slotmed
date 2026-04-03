"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTH_LABELS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

interface Props {
  availableDays: number[]; // 0=Sun … 6=Sat
  selected: Date | null;
  onSelect: (date: Date) => void;
}

export function BookingCalendar({ availableDays, selected, onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function isAvailable(day: number) {
    const date = new Date(viewYear, viewMonth, day);
    return date >= today && availableDays.includes(date.getDay());
  }

  function isSelected(day: number) {
    if (!selected) return false;
    return (
      selected.getFullYear() === viewYear &&
      selected.getMonth() === viewMonth &&
      selected.getDate() === day
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-900">
          {MONTH_LABELS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-1 text-center text-xs font-medium text-gray-400"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const available = isAvailable(day);
          const sel = isSelected(day);

          return (
            <button
              key={day}
              disabled={!available}
              onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
              className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                sel
                  ? "bg-blue-600 text-white"
                  : available
                    ? "hover:bg-blue-50 text-gray-900"
                    : "text-gray-300 cursor-not-allowed"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
