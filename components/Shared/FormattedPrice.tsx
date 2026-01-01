
import React from 'react';

interface Props {
  amount: number;
  currency?: string;
  className?: string; // For container font size/color
}

const FormattedPrice: React.FC<Props> = ({ amount, currency = 'ILS', className = '' }) => {
  // Format to standard en-US string "1,234.56"
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  const [integerPart, decimalPart] = formatted.split('.');

  return (
    <div className={`font-black flex items-baseline gap-0.5 dir-ltr english-nums ${className}`} dir="ltr">
      <span className="leading-none">{integerPart}</span>
      {decimalPart && (
        <span className="text-[0.6em] align-top opacity-80 decoration-transparent">.{decimalPart}</span>
      )}
      {currency && <span className="text-[0.5em] uppercase ml-1 opacity-70">{currency}</span>}
    </div>
  );
};

export default FormattedPrice;
