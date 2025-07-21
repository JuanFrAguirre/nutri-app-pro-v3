import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const DateSelector = ({
  date,
  setDate,
  handleChangeDate,
}: {
  date: string;
  setDate: (date: string) => void;
  handleChangeDate: (direction: number) => void;
}) => {
  return (
    <div className="flex items-center gap-6">
      <button
        className="btn-primary btn shadow-xl!"
        onClick={() => {
          handleChangeDate(-1);
        }}
      >
        <FaArrowLeft />
      </button>
      <div className="flex flex-col gap-2 items-center">
        <input
          type="date"
          className="input text-brand-pink! text-center border-2! border-brand-pink! ring-none! rounded-xl! outline-none! font-medium! text-xl! w-full shadow-md!"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button
        className="btn-primary btn shadow-xl!"
        onClick={() => {
          handleChangeDate(+1);
        }}
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default DateSelector;
