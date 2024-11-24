// src/components/CurrencySelector.tsx
import React from 'react';
import { useRecoilState } from 'recoil';
import { currencyState } from '../recoil/atoms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const CURRENCIES = [
  { code: 'usd', name: 'US Dollar' },
  { code: 'eur', name: 'Euro' },
  { code: 'gbp', name: 'British Pound' },
  { code: 'jpy', name: 'Japanese Yen' },
  { code: 'aud', name: 'Australian Dollar' },
  { code: 'cad', name: 'Canadian Dollar' },
];

export const CurrencySelector: React.FC = () => {
  const [currency, setCurrency] = useRecoilState(currencyState);

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  return (
    <Select 
      value={currency} 
      onValueChange={handleCurrencyChange}
      className='rounded-xl p-2 border dark:bg-gray-700 dark:text-white'
    >
      <SelectTrigger className="w-[180px] ">
        <SelectValue placeholder="Select Currency">
          {CURRENCIES.find(c => c.code === currency)?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            {curr.name} ({curr.code.toUpperCase()})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};