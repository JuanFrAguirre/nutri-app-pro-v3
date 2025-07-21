'use client';
import useLog from '@/hooks/useLog';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import DateSelector from './DateSelector';
import { trimDate } from '@/lib/utils';
import MacrosTable from '@/components/MacrosTable';
import clsx from 'clsx';
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
    <div className="grow flex flex-col justify-end gap-4 pb-[200px]">
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
            isToday ? 'ring-brand-pink! ring-2! border-transparent!' : '',
          )}
        >
          {/*  */}
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam
          fugiat expedita sint! Nisi consequatur voluptas tempora vel
          exercitationem a cum, fugiat nihil neque vero harum odit nostrum modi
          quidem id, sed perferendis quam officiis tempore veniam ducimus
          quisquam fugit ut? Eum quis ea asperiores doloribus corrupti dolor
          eveniet optio fugiat ad enim, facilis ipsa aperiam deserunt rerum
          nesciunt quod est, quaerat quo a corporis facere ducimus eos ullam.
          Dolorum ducimus vitae hic quis rem, autem voluptates consectetur
          voluptas quasi doloremque aliquam voluptate magnam earum, est atque
          natus, aliquid impedit. Exercitationem beatae earum facilis
          laboriosam, iure numquam quisquam quasi amet perferendis ipsam.
          Doloribus tempora quae iure cum laborum et perferendis facilis, vel
          doloremque recusandae? Illum ea, cupiditate quam ex sed nihil tenetur?
          Iure modi molestiae ut temporibus suscipit doloremque error, eveniet
          rem similique accusantium, ratione dolores nulla recusandae, ab maxime
          sapiente laborum sit earum. Nulla ratione perspiciatis eaque est ex
          eveniet, officia modi veritatis voluptatem corrupti facere iste unde
          iusto quo animi, qui esse, provident dignissimos sit fugiat dolores
          dolorem. Sed ex sunt odio accusantium perferendis quibusdam ab nemo
          corporis corrupti labore molestias possimus tenetur minima
          exercitationem veniam iure, quaerat vitae reiciendis facere, dolorem
          vel adipisci? Impedit esse fuga quibusdam cumque dolorem illum ullam
          nobis quia saepe eveniet maiores omnis facere dicta, molestiae
          laudantium iusto, cupiditate mollitia? Asperiores quae odio eligendi
          et quisquam amet vitae temporibus natus. Optio animi expedita neque!
          Qui odio veniam vero nostrum fugit recusandae quaerat, quasi nisi quod
          sequi ipsum praesentium exercitationem velit totam aperiam dolores
          quia animi ipsa non facere, maxime omnis! A corrupti culpa dignissimos
          quam ut ipsam modi non doloremque sint, id fuga, nesciunt atque nam
          dolore tempora eum ratione assumenda itaque dolor, cum adipisci optio
          facilis exercitationem? Porro voluptatum quisquam nulla deserunt vitae
          dolorum tenetur eos. Maxime, eaque? Saepe recusandae amet deserunt,
          iste odio mollitia suscipit modi at, corrupti expedita cupiditate
          libero illo nemo temporibus vel vero voluptas ea blanditiis
          distinctio. Explicabo neque in nesciunt officia at vel molestias ab
          recusandae beatae maiores, corrupti provident tempore id atque,
          quibusdam velit sed perferendis saepe iste totam! Commodi quasi
          laborum id voluptas, et odit sunt ducimus iure consectetur quis eos
          error ipsum laudantium temporibus labore omnis similique in ab facilis
          eaque. Vero nobis laborum saepe dignissimos repudiandae quo
          praesentium recusandae commodi iste quos, eum aliquid, nesciunt
          corporis ab culpa magni, quaerat nam beatae tenetur! Aut perferendis
          distinctio doloremque esse unde dolorum quibusdam voluptates eligendi
          suscipit modi dolore assumenda, quam necessitatibus quos, tempore ea
          commodi nulla deleniti optio explicabo animi delectus quas libero!
          Exercitationem, facilis earum delectus sit nemo nisi iure obcaecati
          nesciunt fugiat, molestias nihil eligendi quo similique ad eaque?
          Quisquam saepe nobis labore, facilis unde est et placeat eos omnis
          voluptates, soluta, ipsam deserunt. Deserunt, dolore? Sed inventore
          doloremque cum adipisci accusantium ea, modi dolores sit nesciunt.
          Nihil eligendi numquam deleniti quae dolorem autem ipsa, ad natus at
          velit quos quod magnam mollitia saepe cupiditate voluptatem delectus.
          Dolorem mollitia deserunt voluptatem maiores assumenda aut, est
          aspernatur enim id voluptatibus totam aliquam! Rem, non sed.
        </div>
      </div>

      <div className="flex flex-col gap-4 bg-brand-white fixed bottom-12 w-full left-0 right-0 p-4 border-t-2 border-brand-grayer/20">
        {/* INFO & ACTIONS */}
        <div className="flex gap-4">
          <MacrosTable
            className="basis-2/3 bg-brand-whiter shadow-md border-2!"
            macros={{ calories: 0, carbs: 0, protein: 0, fats: 0 }}
          />
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
        </div>

        {/* DATE SELECTOR */}
        <div className="flex justify-center">
          <DateSelector
            date={date}
            setDate={setDate}
            handleChangeDate={handleChangeDate}
          />
        </div>
      </div>
    </div>
  );
};

export default LogsList;
