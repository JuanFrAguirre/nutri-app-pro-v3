'use client';
import { useProductStore } from '@/store/productStore';
import { ProductWithQuantity } from '@/types/types';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BsCalendar2DayFill } from 'react-icons/bs';
import { FaCalculator, FaUser } from 'react-icons/fa';
import { FaCartShopping } from 'react-icons/fa6';
import { IoRestaurant } from 'react-icons/io5';
import { MobileNav } from './MobileNav';
import { TabletAndUpwardsNav } from './TabletAndUpwardsNav';

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
