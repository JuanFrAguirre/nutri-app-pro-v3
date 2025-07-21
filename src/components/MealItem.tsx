import { getTotalMacros } from '@/lib/utils';
import { MealWithQuantity } from '@/types/types';
import clsx from 'clsx';
import Image from 'next/image';
import { FaChevronRight } from 'react-icons/fa';
import MacrosTable from './MacrosTable';

const MealItem = ({
  meal,
  buttonsSection,
}: {
  meal: MealWithQuantity;
  buttonsSection: React.ReactNode;
}) => {
  return (
    <div className="shadow-md bg-brand-whiter border-light rounded-xl p-3 flex flex-col">
      <div className="flex flex-col gap-1">
        <p className="font-medium text-brand-grayer text-center text-base text-ellipsis line-clamp-1 pr-2">
          {meal.title}
        </p>
        {meal.mealProducts.length > 0 && (
          <div className="relative">
            {meal.mealProducts.length > 3 && (
              <div className="right-0 absolute top-1/2 -translate-y-1/2 text-brand-pink pointer-events-none bg-brand-whiter rounded-full p-1 border-light shadow-xl flex items-center justify-center">
                <FaChevronRight size={16} className="" />
              </div>
            )}
            <div
              className={clsx(
                'flex gap-3 overflow-x-auto rounded-xl pb-3',
                meal.mealProducts.length > 3
                  ? 'justify-start'
                  : 'justify-center',
              )}
            >
              {meal.mealProducts.map((mp) => (
                <div
                  key={mp._id}
                  className="flex flex-col gap-0.5 items-center border-light bg-white rounded-xl  pb-1 min-w-[25%] basis-[25%]! shadow-md"
                >
                  <Image
                    src={mp.product.image || ''}
                    alt={mp.product.title}
                    width={500}
                    height={500}
                    className="w-auto h-auto rounded-xl"
                  />
                  <p className="text-xs text-brand-grayer font-light">
                    x
                    {(mp.quantity / mp.product.presentationSize) % 1 === 0
                      ? mp.quantity / mp.product.presentationSize
                      : mp.quantity + 'g'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center gap-3">
        <MacrosTable
          className="self-stretch shadow-md"
          macros={{
            calories: getTotalMacros('meal', [meal]).calories,
            fats: getTotalMacros('meal', [meal]).fats,
            carbs: getTotalMacros('meal', [meal]).carbs,
            protein: getTotalMacros('meal', [meal]).protein,
          }}
        />
        {buttonsSection}
      </div>
    </div>
  );
};

export default MealItem;
