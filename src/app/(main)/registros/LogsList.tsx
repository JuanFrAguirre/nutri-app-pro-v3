'use client';
import SummaryAndActions from '@/components/SummaryAndActions';
import useLog from '@/hooks/useLog';
import { trimDate } from '@/lib/utils';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FaPlus } from 'react-icons/fa';

const LogsList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { date } = Object.fromEntries(searchParams.entries());
  const { getLog } = useLog();

  const isToday = useMemo(() => date === trimDate(new Date()), [date]);

  const handleChangeDate = (direction: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + direction);
    router.push(`/registros?date=${trimDate(newDate)}`);
  };

  const setDate = (date: string) => {
    router.push(`/registros?date=${trimDate(new Date(date))}`);
  };

  useEffect(() => {
    if (date) {
      getLog(date);
    }
  }, [getLog, date]);

  return (
    <div className="grow flex flex-col gap-4 pb-[200px]">
      {/* LOG LIST */}
      <div className="relative">
        {isToday && (
          <div className="absolute -top-3 mx-auto w-fit left-0 right-0">
            <p className="text-brand-whiter! bg-brand-pink text-sm! font-medium! rounded-full px-2 py-0.5">
              Hoy
            </p>
          </div>
        )}
        <div
          className={clsx(
            'overflow-y-auto rounded-xl border-light p-4 bg-brand-whiter shadow-xl flex flex-col gap-4',
            // isToday ? 'ring-brand-pink! ring-2! border-transparent!' : '',
          )}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
        </div>
      </div>

      <SummaryAndActions
        isLogs
        date={date}
        setDate={setDate}
        handleChangeDate={handleChangeDate}
        macros={{ calories: 0, carbs: 0, protein: 0, fats: 0 }}
        buttons={
          <div className="basis-1/3 flex flex-col gap-4">
            <button className="btn btn-primary shadow-xl! text-sm!">
              <FaPlus className="w-4 h-4" />
              Añadir
            </button>
            <button className="btn btn-primary shadow-xl! text-sm!">
              <FaPlus className="w-4 h-4" />
              Añadir
            </button>
          </div>
        }
      />
    </div>
  );
};

export default LogsList;
