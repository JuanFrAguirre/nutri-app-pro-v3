'use client';
import { useProductStore } from '@/store/productStore';
import { ProductWithQuantity } from '@/types/types';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { FaCalculator, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { IoRestaurant } from 'react-icons/io5';
import { MobileNav } from './MobileNav';
import { TabletAndUpwardsNav } from './TabletAndUpwardsNav';

const AUTH_LINKS = [
  {
    label: 'Calculadora',
    href: '/calculadora',
    icon: <FaCalculator size={20} />,
    mobileIndex: 1,
    index: 4,
  },
  {
    label: 'Productos',
    href: '/productos',
    icon: <FaCartShopping size={20} />,
    mobileIndex: 2,
    index: 3,
  },
  {
    label: 'Registros',
    href: '/registros?date=' + new Date().toISOString().split('T')[0],
    icon: <FaCalendarAlt size={20} />,
    mobileIndex: 3,
    index: 1,
  },
  {
    label: 'Comidas',
    href: '/comidas',
    icon: <IoRestaurant size={20} />,
    mobileIndex: 4,
    index: 2,
  },
  {
    label: 'Panel',
    href: '/dashboard',
    icon: <FaUser size={20} />,
    mobileIndex: 5,
    index: 5,
  },
];

export type NavProps = {
  links: typeof AUTH_LINKS;
  pathname: string;
  products: ProductWithQuantity[];
};

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

export default Header;
