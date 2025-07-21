import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoMdCalculator } from 'react-icons/io';
import { MdLogout } from 'react-icons/md';
import { NavProps } from './Header';

export const MobileNav = ({ links, pathname, products }: NavProps) => {
  const router = useRouter();

  return (
    <header
      className={clsx(
        'fixed top-0 md:hidden inset-x-0 bg-brand-whiter h-12 md:h-16 flex items-center pt-safe z-[20]',
        'shadow-xl',
      )}
    >
      <div
        className={clsx(
          'container mx-auto flex items-center justify-between relative',
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
          className="text-2xl font-thin tracking-wide link rounded-none! px-5 transition-all duration-500 hover:text-brand-pink text-shadow-md hover:text-shadow-pink-100 flex gap-2 items-center max-w-[50%]"
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
        {pathname === '/dashboard' && (
          <Link
            href={'/logout'}
            prefetch={false}
            className="flex gap-2 items-center text-brand-gray border border-brand-grayer/20 rounded-xl p-1 px-2 mr-4"
          >
            Cerrar sesión <MdLogout size={24} />
          </Link>
        )}

        {/* FIXED BUTTONS */}
        {!!links.length && (
          <>
            {/* BOTTOM NAV */}
            <div className="fixed bottom-0 inset-x-0 bg-brand-whiter flex justify-between shadow-[0_-20px_25px_-5px_rgb(0,0,0,0.1),0_-8px_10px_-6px_rgb(0,0,0,0.1)]">
              {/* MENU BUTTON */}
              {links
                .sort((a, b) => a.mobileIndex - b.mobileIndex)
                .map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={clsx(
                      'text-brand-black flex flex-col items-center gap-px px-3 py-1.5 grow justify-center border-t-[1px] border-t-brand-grayer/20 w-1/5! mobile-link',
                      pathname.includes(link.href.split('?')[0])
                        ? 'bg-brand-black text-brand-white border-t-brand-black'
                        : 'border-t-brand-grayer',
                    )}
                  >
                    {link.icon}
                    <p className="text-xs! font-semibold!">{link.label}</p>
                  </Link>
                ))}
            </div>

            {/* CALCULATOR/STORE BUTTON */}
            {!!products.length && pathname.includes('/productos') && (
              <Link
                href={'/calculadora'}
                className="fixed bottom-16 right-6 bg-brand-whiter border border-brand-black/20 p-1 rounded-xl shadow-xl shadow-brand-black/20"
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
          </>
        )}
      </div>
    </header>
  );
};
