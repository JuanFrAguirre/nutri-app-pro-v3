'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

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
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/home'
        ? []
        : AUTH_LINKS,
    [pathname],
  );

  return (
    <header className="fixed top-0 inset-x-0 bg-brand-whiter shadow-md flex justify-between items-center h-16">
      <Link
        href="/"
        className="text-3xl font-thin tracking-wide link rounded-none! px-5 py-[13px] transition-all duration-500 hover:text-pink-600 text-shadow-md"
      >
        <h1>NutriAppPro</h1>
      </Link>
      <nav className="flex items-center gap-0.5">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            className={clsx(
              'hover:text-pink-500 hover:underline p-5 link font-semibold',
              pathname.includes(link.href) &&
                'border transition-all bg-brand-whiter border-brand-grayer/25 border-b-brand-gray/35 shadow-2xl py-6 rounded-b-sm! duration-500',
            )}
            href={link.href}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
