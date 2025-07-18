'use client';
import { useProductStore } from '@/store/productStore';
import { useRouter } from 'next/navigation';
import { NavProps } from './Header';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdCalculator } from 'react-icons/io';

export const TabletAndUpwardsNav = ({ links, pathname }: NavProps) => {
  const { products } = useProductStore();
  const router = useRouter();

  return (
    <header className="fixed max-md:hidden top-0 inset-x-0 bg-brand-whiter shadow-md h-16 flex items-center">
      <div
        className={clsx(
          'container mx-auto flex items-center',
          pathname === '/iniciar-sesion' || pathname === '/crear-cuenta'
            ? 'justify-center'
            : 'justify-between',
        )}
      >
        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            if (pathname === '/iniciar-sesion') return;
            if (pathname.includes('/registros'))
              window.location.href = '/registros?date=' + today;
            else router.push('/registros?date=' + today);
          }}
          className="text-2xl lg:text-3xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100 py-[14px] flex gap-2"
        >
          <Image
            src="/centered-logo.png"
            alt="NutriAppPro"
            width={100}
            height={100}
            className="w-10 h-10"
          />
          <h1>NutriAppPro</h1>
        </button>

        {/* CALCULATOR/STORE BUTTON */}
        {!!products.length &&
          pathname !== '/calculadora' &&
          !pathname.includes('/registros') && (
            <Link
              href={'/calculadora'}
              className="fixed top-28 right-6 bg-brand-whiter border border-brand-black p-1 rounded-sm shadow-xl shadow-brand-black/20 flex items-center"
            >
              {/* <p>Productos en calculadora</p> */}
              <div className="bg-brand-pink w-[22px] h-[22px] absolute -top-3 -right-[10px] rounded-full grid place-items-center">
                <p className="text-brand-whiter text-sm font-bold">
                  {products.length}
                </p>
              </div>
              <IoMdCalculator
                className={clsx('w-12 h-12 transition-all duration-500')}
              />
            </Link>
          )}

        <nav className="flex items-center">
          {links.map((link) => {
            if (
              link.href.includes('/registros') &&
              pathname.includes('/registros')
            ) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={clsx(
                    'font-medium p-3 py-[22px] lg:px-6 lg:py-5 link max-lg:text-sm text-shadow-md text-shadow-transparent rounded-none!',
                    'hover:text-brand-white hover:bg-brand-black',
                    pathname.includes(link.href)
                      ? 'bg-brand-black text-white'
                      : '',
                  )}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                className={clsx(
                  'font-medium p-3 py-[22px] lg:px-6 lg:py-5 link max-lg:text-sm text-shadow-md text-shadow-transparent rounded-none!',
                  'hover:text-brand-white hover:bg-brand-black',
                  pathname.includes(link.href)
                    ? 'bg-brand-black text-white'
                    : '',
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
