import React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CURRENCIES = [
  { code: 'usd', name: 'US Dollar', symbol: '$' },
  { code: 'eur', name: 'Euro', symbol: '€' },
  { code: 'gbp', name: 'British Pound', symbol: '£' },
  { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
  { code: 'aud', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'cad', name: 'Canadian Dollar', symbol: 'C$' },
] as const;

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const selectedCurrency = CURRENCIES.find(c => c.code === value);

  return (
    <div className="relative">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className={`w-[200px] flex items-center justify-between px-3 py-2 text-sm bg-gray-700 text-white hover:bg-gray-600 ${className}`}
        >
          <SelectValue>
            {selectedCurrency ? (
              <span className="flex items-center gap-2 text-white">
                <span className="font-mono">{selectedCurrency.symbol}</span>
                {selectedCurrency.name}
              </span>
            ) : (
              <span className="text-gray-300">Select Currency</span>
            )}
          </SelectValue>
          <ChevronsUpDown className="h-4 w-4 opacity-50 text-gray-300" />
        </SelectTrigger>
        <SelectContent >
          {CURRENCIES.map((currency) => (
            <SelectItem
              key={currency.code}
              value={currency.code}
              className="flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-gray-600 focus:bg-gray-600 data-[highlighted]:bg-gray-600"
            >
              <span className="flex items-center  gap-2">
                <span className="font-mono w-6">{currency.symbol}</span>
                <span>{currency.name}</span>
                <span className="text-gray-300 ml-1">
                  ({currency.code.toUpperCase()})
                </span>
              </span>
              {value === currency.code && (
                <Check className="h-4 w-4 text-white" />
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;