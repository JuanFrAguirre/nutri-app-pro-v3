'use client';
import React from 'react';
import Modal from '@/components/Modal';
import { ProductWithQuantity } from '@/types/types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import { toast } from 'react-toastify';

const EditProductModal = ({
  isOpen,
  setIsOpen,
  onClose,
  product,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose: () => void;
  product: ProductWithQuantity;
}) => {
  // validation schema
  const schema = yup.object().shape({
    title: yup.string().required('El título es requerido'),
    image: yup
      .string()
      .url('La URL de la imagen no es válida')
      .required('La URL de la imagen es requerida'),
    calories: yup
      .number()
      .typeError('Las calorías deben ser un número')
      .required('Las calorías son requeridas')
      .min(0, 'Las calorías deben ser >= 0'),
    fats: yup
      .number()
      .typeError('Las grasas deben ser un número')
      .required('Las grasas son requeridas')
      .min(0, 'Las grasas deben ser >= 0'),
    carbs: yup
      .number()
      .typeError('Los carbohidratos deben ser un número')
      .required('Los carbohidratos son requeridos')
      .min(0, 'Los carbohidratos deben ser >= 0'),
    protein: yup
      .number()
      .typeError('Las proteínas deben ser un número')
      .required('Las proteínas son requeridas')
      .min(0, 'Las proteínas deben ser >= 0'),
    presentationSize: yup
      .number()
      .typeError('El tamaño de presentación debe ser un número')
      .required('El tamaño de presentación es requerido')
      .min(0, 'El tamaño de presentación debe ser >= 0'),
    tags: yup.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      title: product.title,
      image: product.image || '',
      calories: product.calories,
      fats: product.fats,
      carbs: product.carbs,
      protein: product.protein,
      presentationSize: product.presentationSize,
      tags: product.tags || '',
    },
  });

  React.useEffect(() => {
    reset({
      title: product.title,
      image: product.image || '',
      calories: product.calories,
      fats: product.fats,
      carbs: product.carbs,
      protein: product.protein,
      presentationSize: product.presentationSize,
      tags: product.tags || '',
    });
  }, [product, reset]);

  const onSubmit = handleSubmit((data) => {
    try {
      console.log('Edited product:', data);
    } catch (error) {
      console.error(error);
      toast.error('Error al editar el producto');
    } finally {
      onClose();
    }
  });

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onClose={onClose}>
      <p className="title">Editar producto</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="label">
            Título
          </label>
          <input
            id="title"
            type="text"
            className={clsx('input', errors.title && 'error')}
            {...register('title')}
          />
          {errors.title && (
            <small className="text-error">{errors.title.message}</small>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="image" className="label">
            Imagen (URL)
          </label>
          <input
            id="image"
            type="text"
            className={clsx('input', errors.image && 'error')}
            {...register('image')}
          />
          {errors.image && (
            <small className="text-error">{errors.image.message}</small>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="calories" className="label">
              Calorías
            </label>
            <input
              id="calories"
              type="number"
              className={clsx('input', errors.calories && 'error')}
              {...register('calories', { valueAsNumber: true })}
            />
            {errors.calories && (
              <small className="text-error">{errors.calories.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="fats" className="label">
              Grasas
            </label>
            <input
              id="fats"
              type="number"
              className={clsx('input', errors.fats && 'error')}
              {...register('fats', { valueAsNumber: true })}
            />
            {errors.fats && (
              <small className="text-error">{errors.fats.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="carbs" className="label">
              Carbohidratos
            </label>
            <input
              id="carbs"
              type="number"
              className={clsx('input', errors.carbs && 'error')}
              {...register('carbs', { valueAsNumber: true })}
            />
            {errors.carbs && (
              <small className="text-error">{errors.carbs.message}</small>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="protein" className="label">
              Proteínas
            </label>
            <input
              id="protein"
              type="number"
              className={clsx('input', errors.protein && 'error')}
              {...register('protein', { valueAsNumber: true })}
            />
            {errors.protein && (
              <small className="text-error">{errors.protein.message}</small>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="presentationSize" className="label">
            Tamaño de presentación
          </label>
          <input
            id="presentationSize"
            type="number"
            className={clsx('input', errors.presentationSize && 'error')}
            {...register('presentationSize', { valueAsNumber: true })}
          />
          {errors.presentationSize && (
            <small className="text-error">
              {errors.presentationSize.message}
            </small>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="tags" className="label">
            Etiquetas (separadas por comas)
          </label>
          <input
            id="tags"
            type="text"
            className={clsx('input', errors.tags && 'error')}
            {...register('tags')}
          />
          {errors.tags && (
            <small className="text-error">{errors.tags.message}</small>
          )}
        </div>
        <div className="flex justify-center gap-3 mt-6">
          <button
            type="button"
            className="btn btn-plain grow"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary grow"
            disabled={!isValid}
          >
            Confirmar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProductModal;
