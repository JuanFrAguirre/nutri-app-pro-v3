'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { IoMdMenu } from 'react-icons/io';

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
  const LINKS = useMemo(
    () =>
      pathname === '/' ||
      pathname === '/iniciar-sesion' ||
      pathname === '/crear-cuenta' ||
      pathname === '/home'
        ? []
        : AUTH_LINKS,
    [pathname],
  );

  return (
    <>
      <MobileNav links={LINKS} pathname={pathname} />
      <TabletAndUpwardsNav links={LINKS} pathname={pathname} />
    </>
  );
};

type NavProps = { links: typeof AUTH_LINKS; pathname: string };

const MobileNav = ({ links, pathname }: NavProps) => {
  console.log({ links, pathname });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = () => {
    setIsMenuOpen(false);
  };
  return (
    <header className="fixed bottom-0 md:hidden inset-x-0 bg-brand-whiter shadow-md h-12 md:h-16 flex items-center">
      <div
        className={clsx(
          'container mx-auto flex items-center',
          !!links.length ? 'justify-between' : 'justify-center',
        )}
      >
        <Link
          href="/"
          className="text-2xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100"
        >
          <h1>NutriAppPro</h1>
        </Link>
        {!!links.length && (
          <nav className="relative flex items-center mr-5">
            <button
              className="rounded-xs"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <IoMdMenu
                className={clsx(
                  'text-4xl transition-all duration-500 text-brand-pink',
                )}
              />
            </button>
            <div
              onClick={() => setIsMenuOpen(false)}
              className={clsx(
                'bg-black/5 backdrop-blur-[2px] fixed inset-0',
                isMenuOpen ? '' : 'hidden',
              )}
            ></div>
            <div
              className={clsx(
                'flex flex-col gap-2 absolute bottom-[100%] right-4 bg-brand-whiter shadow-xl border border-brand-grayer/25 rounded-xs p-2 transition-all duration-500 min-w-[150px]',
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
                    'p-2 w-full',
                    pathname.includes(link.href) && 'underline text-brand-pink',
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
  return (
    <header className="fixed max-md:hidden top-0 inset-x-0 bg-brand-whiter shadow-md h-16 flex items-center">
      <div
        className={clsx(
          'container mx-auto flex items-center',
          !!links.length ? 'justify-between' : 'justify-center',
        )}
      >
        <Link
          href="/"
          className="text-2xl lg:text-3xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100"
        >
          <h1>NutriAppPro</h1>
        </Link>
        <nav className="flex items-center lg:gap-0.5">
          {links.map((link) => (
            <Link
              key={link.label}
              className={clsx(
                'hover:text-brand-pink hover:underline p-3 lg:p-5 link font-medium lg:font-semibold max-lg:text-sm text-shadow-md text-shadow-transparent',
                pathname.includes(link.href) && 'underline text-brand-pink',
              )}
              href={link.href}
            >
              <p>{link.label}</p>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
