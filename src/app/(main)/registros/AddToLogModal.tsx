import Modal from '@/components/Modal';
import clsx from 'clsx';
import { useState } from 'react';

const AddToLogModal = ({
  isOpen,
  setIsOpen,
  handleCloseModal,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleCloseModal: () => void;
}) => {
  const [selectedTab, setSelectedTab] = useState<'meals' | 'products'>('meals');
  // const resetModal = () => {
  //   setSelectedTab('meals');
  // };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={() => handleCloseModal()}
    >
      <div className="flex flex-col">
        <div>
          <button
            onClick={() => setSelectedTab('meals')}
            className={clsx(
              'btn',
              selectedTab === 'meals' ? 'btn-primary' : 'btn-plain',
            )}
          >
            <p>Comidas</p>
          </button>
          <button
            onClick={() => setSelectedTab('products')}
            className={clsx(
              'btn',
              selectedTab === 'products' ? 'btn-primary' : 'btn-plain',
            )}
          >
            <p>Productos</p>
          </button>
        </div>
        {/* {selectedTab === 'meals' ? (
          <div>
            {!!selectedMeals?.length ? (
              <p>SELECTED MEALS</p>
            ) : (
              <div>
                <p className="text-brand-grayer">
                  No hay comidas para mostrar. Creá alguna en la sección de
                  productos.
                </p>
                <Link href="/productos">Productos</Link>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!!selectedProducts?.length ? (
              <p>SELECTED PRODUCTS</p>
            ) : (
              <div>
                <p className="text-brand-grayer">
                  No hay productos para mostrar.
                </p>
                <Link href="/productos">Productos</Link>
              </div>
            )}
          </div>
        )} */}
      </div>
    </Modal>
  );
};

export default AddToLogModal;
