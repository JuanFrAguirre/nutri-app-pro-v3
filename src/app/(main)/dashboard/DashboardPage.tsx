'use client';
import DividedTextLine from '@/components/DividedTextLine';
import { useGetUser } from '@/hooks/useAuth';
import { useLogs } from '@/hooks/useLogs';
import {
  customFixedRound,
  formatDate,
  getTotalMacros,
  macrosIndexed,
  macrosKeys,
} from '@/lib/utils';
import { Log } from '@/types/types';
import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useGetUser();
  const { logs, setStartDate } = useLogs();
  const [selectedTimeRange, setSelectedTimeRange] = useState<
    'week' | 'fortnight' | 'month'
  >('week');

  const handleTimeRangeChange = (timeRange: 'week' | 'fortnight' | 'month') => {
    setSelectedTimeRange(timeRange);
    if (timeRange === 'week') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    } else if (timeRange === 'fortnight') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 15)));
    } else if (timeRange === 'month') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    }
  };

  return (
    <div className="grow flex flex-col gap-5">
      {/* <Link href={'/logout'} className="fixed top-28 right-6 btn btn-plain">
        Cerrar sesión
      </Link> */}
      <p className="subtitle">
        Bienvenido de nuevo, {user?.firstName} {user?.lastName}!
      </p>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => handleTimeRangeChange('week')}
          className={clsx(
            'btn',
            selectedTimeRange === 'week' ? 'btn-primary' : 'btn-plain',
          )}
        >
          <p>Últimos 7 días</p>
        </button>
        <button
          onClick={() => handleTimeRangeChange('fortnight')}
          className={clsx(
            'btn',
            selectedTimeRange === 'fortnight' ? 'btn-primary' : 'btn-plain',
          )}
        >
          <p>Últimos 15 días</p>
        </button>
        <button
          onClick={() => handleTimeRangeChange('month')}
          className={clsx(
            'btn',
            selectedTimeRange === 'month' ? 'btn-primary' : 'btn-plain',
          )}
        >
          <p>Último mes</p>
        </button>
      </div>
      <div className="gap-4 grid grid-cols-2">
        {logs.map((log) => (
          <LogCard key={log._id} log={log} />
        ))}
      </div>
    </div>
  );
};

const LogCard = ({ log }: { log: Log }) => (
  <div
    key={log._id}
    className="border-light bg-brand-whiter p-4 shadow-xl flex justify-center flex-col gap-4"
  >
    <p className="self-center font-semibold text-lg">
      {formatDate(log.date, true)[0].toUpperCase() +
        formatDate(log.date, true).slice(1)}
    </p>
    <div>
      {macrosKeys.map((mk) => (
        <DividedTextLine
          key={mk}
          first={macrosIndexed[mk].label}
          second={
            customFixedRound(
              Number(
                getTotalMacros('logMeal', log?.logMeals)[mk] +
                  getTotalMacros('logProduct', log?.logProducts)[mk],
              ),
              true,
            ) + macrosIndexed[mk].unit
          }
        />
      ))}
    </div>
    <div className="flex justify-center items-center">
      <Link
        className="btn btn-primary flex gap-4 items-center"
        href={`/registros?date=${new Date(log.date).toISOString()}`}
      >
        Ver
        <FaChevronRight className="w-6 h-6" />
      </Link>
    </div>
  </div>
);

export default DashboardPage;
