import React from 'react';
import { MapPin } from 'lucide-react';

interface CityComboboxProps {
  value: string;
  onChange: (city: string) => void;
  error?: string;
  id?: string;
}

export const CityCombobox: React.FC<CityComboboxProps> = ({
  value,
  onChange,
  error,
  id = "city"
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <MapPin className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none z-10" />
        <input
          type="text"
          id={id}
          name="city"
          autoComplete="address-level2"
          placeholder="Skriv din stad..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ paddingLeft: '36px', paddingRight: '14px' }}
          className={`w-full h-11 bg-white border ${
            error ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-300 hover:border-gray-400'
          } focus:border-brand focus:ring-2 focus:ring-brand/20 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-150`}
        />
      </div>
    </div>
  );
};

