import DateSelector from '@/app/(main)/registros/DateSelector';
import React from 'react';
import MacrosTable from './MacrosTable';

const SummaryAndActions = ({
  isLogs = false,
  date,
  setDate,
  handleChangeDate,
  buttons,
  macros,
}: {
  isLogs?: boolean;
  date?: string;
  setDate?: (date: string) => void;
  handleChangeDate?: (direction: number) => void;
  buttons?: React.ReactNode;
  macros: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}) => {
  return (
    <div className="flex flex-col gap-4 bg-brand-whiter fixed bottom-12 w-full left-0 right-0 p-4 border-t-2 border-brand-grayer/20 shadow-upwards">
      {/* INFO & ACTIONS */}
      <div className="flex gap-4">
        <MacrosTable
          className="basis-2/3 bg-brand-whiter shadow-md border-2!"
          macros={macros}
        />
        {buttons}
      </div>

      {/* DATE SELECTOR */}
      {isLogs && (
        <div className="flex justify-between">
          <DateSelector
            date={date!}
            setDate={setDate!}
            handleChangeDate={handleChangeDate!}
          />
        </div>
      )}
    </div>
  );
};

export default SummaryAndActions;
