'use client';
import { useProductStore } from '@/store/productStore';
import { ProductWithQuantity } from '@/types/types';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { BsCalendar2DayFill } from 'react-icons/bs';
import { FaCalculator, FaUser } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { IoMdCalculator } from 'react-icons/io';
import { IoRestaurant } from 'react-icons/io5';

const AUTH_LINKS = [
  {
    label: 'Calculadora',
    href: '/calculadora',
    icon: <FaCalculator className="w-6 h-6" />,
    mobileIndex: 1,
    index: 4,
  },
  {
    label: 'Productos',
    href: '/productos',
    icon: <FaCartShopping className="w-6 h-6" />,
    mobileIndex: 2,
    index: 3,
  },
  {
    label: 'Registros',
    href: '/registros?date=' + new Date().toISOString().split('T')[0],
    icon: <BsCalendar2DayFill className="w-6 h-6" />,
    mobileIndex: 3,
    index: 1,
  },
  {
    label: 'Comidas',
    href: '/comidas',
    icon: <IoRestaurant className="w-6 h-6" />,
    mobileIndex: 4,
    index: 2,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <FaUser className="w-6 h-6" />,
    mobileIndex: 5,
    index: 5,
  },
];

const Header = () => {
  const pathname = usePathname();
  const { products } = useProductStore();
  const LINKS = useMemo(
    () =>
      pathname === '/iniciar-sesion' || pathname === '/crear-cuenta'
        ? []
        : AUTH_LINKS,
    [pathname],
  );

  return (
    <>
      <MobileNav links={LINKS} pathname={pathname} products={products} />
      <TabletAndUpwardsNav
        links={LINKS}
        pathname={pathname}
        products={products}
      />
    </>
  );
};

type NavProps = {
  links: typeof AUTH_LINKS;
  pathname: string;
  products: ProductWithQuantity[];
};

const MobileNav = ({ links, pathname, products }: NavProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleNavigate = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={clsx(
        'fixed top-0 md:hidden inset-x-0 bg-brand-whiter h-12 md:h-16 flex items-center pt-safe z-[20]',
        pathname === '/productos' ||
          pathname === '/comidas' ||
          pathname.includes('/registros')
          ? ''
          : 'shadow-xl',
      )}
    >
      <div
        className={clsx('container mx-auto flex items-center justify-center')}
      >
        <button
          onClick={() => {
            const today = new Date().toISOString().split('T')[0];
            if (pathname === '/iniciar-sesion') return;
            if (pathname.includes('/registros'))
              window.location.href = '/registros?date=' + today;
            else router.push('/registros?date=' + today);
          }}
          className="text-2xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100 flex gap-2 items-center"
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

        {/* FIXED BUTTONS */}
        {!!links.length && (
          <nav className="relative">
            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 inset-x-0 bg-brand-whiter flex justify-between border-t-[1px] border-brand-black/20">
              {/* MENU BUTTON */}
              {/* <button
                className="bg-blue-500"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <IoMdMenu
                  className={clsx('w-10 h-10 transition-all duration-500')}
                />
              </button> */}
              {links
                .sort((a, b) => a.mobileIndex - b.mobileIndex)
                .map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={clsx(
                      'text-brand-black flex items-center gap-2 p-3 grow justify-center',
                      pathname.includes(link.href.split('?')[0]) &&
                        'bg-brand-black text-brand-white',
                    )}
                  >
                    {link.icon}
                  </Link>
                ))}
            </div>

            {/* CALCULATOR/STORE BUTTON */}
            {!!products.length &&
              !pathname.includes('/calculadora') &&
              !pathname.includes('/registros') && (
                <Link
                  href={'/calculadora'}
                  className="fixed bottom-16 right-6 bg-brand-whiter border border-brand-black/20 p-1 rounded-sm shadow-xl shadow-brand-black/20"
                >
                  <div className="bg-brand-pink w-[22px] h-[22px] absolute -top-3 -right-[10px] rounded-full grid place-items-center">
                    <p className="text-brand-whiter text-sm font-semibold">
                      {products.length}
                    </p>
                  </div>
                  <IoMdCalculator
                    size={40}
                    className={clsx('transition-all duration-500')}
                  />
                </Link>
              )}

            {/* OPENABLE MENU */}
            <div
              onClick={() => setIsMenuOpen(false)}
              className={clsx(
                'bg-black/5 backdrop-blur-[2px] fixed inset-0',
                isMenuOpen ? '' : 'hidden',
              )}
            />
            <div
              className={clsx(
                'flex flex-col justify-end gap-2 fixed bottom-0 right-0 bg-brand-whiter shadow-xl border border-brand-gray/30 rounded-xs transition-all duration-400 min-w-[15  0px]',
                isMenuOpen
                  ? 'translate-x-0 translate-y-0'
                  : 'translate-x-[125%] translate-y-[5%]',
              )}
            >
              {links.map((link) => {
                if (
                  link.href.includes('/registros') &&
                  pathname.includes('/registros')
                ) {
                  console.log({ pathname, link: link.href });
                  return (
                    <a
                      onClick={handleNavigate}
                      key={link.label}
                      href={link.href}
                      className={clsx(
                        'px-10 py-3 hover:bg-brand-black hover:text-brand-white w-full',
                        pathname.includes(link.href.split('?')[0]) &&
                          'bg-brand-black text-brand-white',
                      )}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    onClick={handleNavigate}
                    key={link.label}
                    href={link.href}
                    className={clsx(
                      'px-10 py-3 hover:bg-brand-black hover:text-brand-white w-full',
                      pathname.includes(link.href) &&
                        'bg-brand-black text-brand-white',
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const TabletAndUpwardsNav = ({ links, pathname }: NavProps) => {
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

export default Header;
