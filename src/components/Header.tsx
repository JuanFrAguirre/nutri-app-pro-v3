'use client';
import { useProductStore } from '@/store/productStore';
import { Product } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoMdCart, IoMdMenu } from 'react-icons/io';

const AUTH_LINKS = [
  {
    label: 'Registros',
    href: '/registros',
  },
  {
    label: 'Comidas',
    href: '/comidas',
  },
  {
    label: 'Productos',
    href: '/productos',
  },
  {
    label: 'Calculadora',
    href: '/calculadora',
  },
  {
    label: 'Cerrar sesión',
    href: '/logout',
  },
];

const Header = () => {
  const pathname = usePathname();
  const { products } = useProductStore();
  const LINKS = useMemo(
    () =>
      pathname === '/iniciar-sesion' ||
      pathname === '/crear-cuenta' ||
      pathname === '/home'
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
  products: Product[];
};

const MobileNav = ({ links, pathname, products }: NavProps) => {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = () => {
    setIsMenuOpen(false);
  };
  return (
    <header className="fixed top-0 md:hidden inset-x-0 bg-brand-whiter shadow-xl h-12 md:h-16 flex items-center pt-safe">
      <div
        className={clsx('container mx-auto flex items-center justify-center')}
      >
        <button
          onClick={() => {
            if (pathname === '/registros' || pathname === '/iniciar-sesion')
              return;
            router.push('/');
          }}
          className="text-2xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100"
        >
          <h1>NutriAppPro</h1>
        </button>

        {/* FIXED BUTTONS */}
        {!!links.length && (
          <nav className="relative">
            {/* MENU BUTTON */}
            <button
              className="fixed bottom-10 right-6 bg-brand-whiter border border-brand-black p-1 rounded-sm shadow-xl shadow-brand-black/20"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <IoMdMenu
                className={clsx('w-10 h-10 transition-all duration-500')}
              />
            </button>

            {/* CALCULATOR/STORE BUTTON */}
            {!!products.length && (
              <Link
                href={'/calculadora'}
                className="fixed bottom-28 right-6 bg-brand-whiter border border-brand-black p-1 rounded-sm shadow-xl shadow-brand-black/20"
              >
                <div className="bg-brand-pink w-[22px] h-[22px] absolute -top-3 -right-[10px] rounded-full grid place-items-center">
                  <p className="text-brand-whiter text-xs font-semibold">
                    {products.length}
                  </p>
                </div>
                <IoMdCart
                  className={clsx('w-10 h-10 transition-all duration-500')}
                />
              </Link>
            )}
            <div
              onClick={() => setIsMenuOpen(false)}
              className={clsx(
                'bg-black/5 backdrop-blur-[2px] fixed inset-0',
                isMenuOpen ? '' : 'hidden',
              )}
            />
            <div
              className={clsx(
                'flex flex-col justify-end gap-2 fixed bottom-5 right-5 bg-brand-whiter shadow-xl border border-brand-gray/30 rounded-xs transition-all duration-400 min-w-[150px]',
                isMenuOpen
                  ? 'translate-x-0 translate-y-0'
                  : 'translate-x-[125%] translate-y-[20%]',
              )}
            >
              {links.map((link) => (
                <Link
                  onClick={handleNavigate}
                  key={link.label}
                  href={link.href}
                  className={clsx(
                    'px-4 py-2 hover:bg-brand-black hover:text-brand-white w-full',
                    pathname.includes(link.href) &&
                      'bg-brand-black text-brand-white',
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

const TabletAndUpwardsNav = ({ links, pathname }: NavProps) => {
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
            if (pathname === '/registros' || pathname === '/iniciar-sesion')
              return;
            router.push('/');
          }}
          className="text-2xl lg:text-3xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100 py-[14px]"
        >
          <h1>NutriAppPro</h1>
        </button>
        <nav className="flex items-center">
          {links.map((link) => (
            <Link
              key={link.label}
              className={clsx(
                'font-medium p-3 py-[22px] lg:px-6 lg:py-5 link max-lg:text-sm text-shadow-md text-shadow-transparent rounded-none!',
                'hover:text-brand-white hover:bg-brand-black',
                pathname.includes(link.href) ? 'bg-brand-black text-white' : '',
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
