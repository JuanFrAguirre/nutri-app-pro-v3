'use client';
import MacrosTable from '@/components/MacrosTable';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { useGetUser } from '@/hooks/useAuth';
import { useDashboardLogs } from '@/hooks/useDashboardLogs';
import { formatDate, getTotalMacros } from '@/lib/utils';
import { Log } from '@/types/types';
import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaChevronRight } from 'react-icons/fa';

type TimeRange = 'week' | 'fortnight' | 'month';

const timeRanges: Record<TimeRange, string> = {
  week: 'Últimos 7 días',
  fortnight: 'Últimos 15 días',
  month: 'Último mes',
};

const DashboardPage = () => {
  const { user } = useGetUser();
  const { logs, setStartDate } = useDashboardLogs();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('week');
  const { isLoading, setIsLoading } = useLoadingContext();

  const handleTimeRangeChange = (timeRange: TimeRange) => {
    setSelectedTimeRange(timeRange);
    if (timeRange === 'week') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    } else if (timeRange === 'fortnight') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 15)));
    } else if (timeRange === 'month') {
      setStartDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    if (user) {
      setIsLoading(false);
    }
  }, [user, setIsLoading]);

  if (isLoading || !user) return '';

  return (
    user && (
      <div className="grow flex flex-col gap-5">
        <p className="subtitle">Bienvenido de nuevo, {user?.firstName}!</p>
        <div className="flex justify-center gap-2">
          {Object.keys(timeRanges).map((timeRange) => (
            <button
              key={timeRange}
              onClick={() => handleTimeRangeChange(timeRange as TimeRange)}
              className={clsx(
                'btn max-md:text-xs!',
                selectedTimeRange === timeRange ? 'btn-primary' : 'btn-plain',
              )}
            >
              <p>{timeRanges[timeRange as TimeRange]}</p>
            </button>
          ))}
        </div>
        {!!logs.length ? (
          <div className="gap-4 grid grid-cols-2">
            {logs.map((log) => (
              <LogCard key={log._id} log={log} />
            ))}
          </div>
        ) : (
          <div className="grow flex items-center justify-center">
            <p className="text-center text-brand-grayer">
              No hay registros para mostrar en este rango.
            </p>
          </div>
        )}
      </div>
    )
  );
};

const LogCard = ({ log }: { log: Log }) => (
  <div
    key={log._id}
    className="border-light bg-brand-whiter p-3 shadow-md flex justify-center flex-col gap-3 rounded-xl"
  >
    <p className="self-center font-semibold text-lg text-center">
      {formatDate(log.date, true)[0].toUpperCase() +
        formatDate(log.date, true).slice(1)}
    </p>
    <div>
      <MacrosTable
        macros={{
          calories:
            getTotalMacros('logMeal', log?.logMeals).calories +
            getTotalMacros('logProduct', log?.logProducts).calories,
          fats:
            getTotalMacros('logMeal', log?.logMeals).fats +
            getTotalMacros('logProduct', log?.logProducts).fats,
          carbs:
            getTotalMacros('logMeal', log?.logMeals).carbs +
            getTotalMacros('logProduct', log?.logProducts).carbs,
          protein:
            getTotalMacros('logMeal', log?.logMeals).protein +
            getTotalMacros('logProduct', log?.logProducts).protein,
        }}
      />
    </div>
    <div className="flex justify items-center">
      <Link
        className="btn btn-primary flex gap-4 items-center justify-center grow"
        href={`/registros?date=${new Date(log.date).toISOString()}`}
      >
        <div className="flex justify-center items-center gap-2">
          Ver
          <FaChevronRight size={20} />
        </div>
      </Link>
    </div>
  </div>
);

export default DashboardPage;
