'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

const AUTH_LINKS = [
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

const NOT_AUTH_LINKS = [
  {
    label: 'Inicio',
    href: '/home',
  },
  {
    label: 'Iniciar sesión',
    href: '/login',
  },
  {
    label: 'Crear cuenta',
    href: '/register',
  },
];

const Header = () => {
  const pathname = usePathname();
  const LINKS = useMemo(
    () =>
      pathname === '/login' || pathname === '/register' || pathname === '/home'
        ? NOT_AUTH_LINKS
        : AUTH_LINKS,
    [pathname],
  );

  return (
    <header className="fixed top-0 inset-x-0 bg-white shadow-md flex justify-between items-center h-16">
      <Link
        href="/"
        className="text-3xl font-thin tracking-wide link rounded-none! px-5 py-[13px] text-black hover:text-pink-600 transition-all"
      >
        <h1>NutriAppPro</h1>
      </Link>
      <nav className="flex items-center">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            className="hover:bg-brand-black hover:text-brand-white transition-all p-5 link rounded-none!"
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
