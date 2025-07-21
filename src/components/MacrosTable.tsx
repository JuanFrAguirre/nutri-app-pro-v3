import { MacrosTable as MacrosTableType } from '@/types/types';
import React from 'react';
import DividedTextLine from './DividedTextLine';
import { customFixedRound, macrosIndexed, macrosKeys } from '@/lib/utils';
import clsx from 'clsx';

const MacrosTable = ({
  macros,
  className,
}: {
  macros: MacrosTableType;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'p-2 border-light rounded-xl grow flex flex-col justify-between',
        className,
      )}
    >
      {macrosKeys.map((mk) => (
        <DividedTextLine
          key={mk}
          first={macrosIndexed[mk].label}
          second={customFixedRound(macros[mk]) + macrosIndexed[mk].unit}
        />
      ))}
    </div>
  );
};

export default MacrosTable;
