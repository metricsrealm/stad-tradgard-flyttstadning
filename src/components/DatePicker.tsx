import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { sv } from 'date-fns/locale';
import { format, parseISO, isValid } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import 'react-day-picker/style.css';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (dateStr: string) => void;
  error?: string;
  id?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  error,
  id = 'cleaningDate'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selectedDate = value && isValid(parseISO(value)) ? parseISO(value) : undefined;

  // Handle click outside to close popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'yyyy-MM-dd');
      onChange(formatted);
      setIsOpen(false);
    } else {
      onChange('');
    }
  };

  const formattedDisplay = selectedDate
    ? format(selectedDate, 'd MMMM yyyy', { locale: sv })
    : '';

  return (
    <div className="relative w-full" ref={popoverRef}>
      <button
        type="button"
        id={id}
        aria-label="Välj flyttdatum"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 flex items-center justify-between bg-white border ${
          error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 hover:border-gray-400'
        } focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-lg px-3.5 text-sm transition-all duration-150 cursor-pointer text-left`}
      >
        <span className={`flex items-center gap-2.5 ${formattedDisplay ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
          <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {formattedDisplay || 'Välj flyttdatum i kalendern...'}
        </span>
        {formattedDisplay ? (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange('');
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            title="Rensa datum"
          >
            <X className="w-3.5 h-3.5" />
          </span>
        ) : (
          <span className="text-xs font-semibold text-brand bg-brand/5 px-2 py-0.5 rounded">
            Kalender
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 z-50 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3.5 sm:p-4 text-gray-900 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Välj flyttdatum
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <DayPicker
            mode="single"
            locale={sv}
            selected={selectedDate}
            onSelect={handleSelect}
            disabled={{ before: new Date() }}
            className="p-1 custom-calendar text-sm"
          />
        </div>
      )}
    </div>
  );
};
