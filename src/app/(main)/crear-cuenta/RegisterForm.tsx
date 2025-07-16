'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { yupResolver } from '@hookform/resolvers/yup';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type RegisterFormDataKeys =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'password'
  | 'confirmPassword';

const REGISTER_FORM_FIELDS = [
  {
    id: 'firstName',
    label: 'Nombre',
    name: 'firstName',
    type: 'text',
    placeholder: 'Juan',
    autocomplete: true,
  },
  {
    id: 'lastName',
    label: 'Apellido',
    name: 'lastName',
    type: 'text',
    placeholder: 'Perez',
    autocomplete: true,
  },
  {
    id: 'email',
    label: 'Correo electrónico',
    name: 'email',
    type: 'email',
    placeholder: 'juan@perez.com',
    autocomplete: true,
  },
  {
    id: 'password',
    label: 'Contraseña',
    name: 'password',
    type: 'password',
    placeholder: '********',
  },
  {
    id: 'confirmPassword',
    label: 'Confirmar contraseña',
    name: 'confirmPassword',
    type: 'password',
    placeholder: '********',
  },
];

const RegisterForm = () => {
  const { isLoading, setIsLoading } = useLoadingContext();
  const schema = yupResolver(
    yup.object().shape({
      firstName: yup
        .string()
        .required('El nombre es requerido')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),
      lastName: yup
        .string()
        .required('El apellido es requerido')
        .min(3, 'El apellido debe tener al menos 3 caracteres'),
      email: yup
        .string()
        .email('El correo electrónico no es válido')
        .required('El correo electrónico es requerido')
        .min(3, 'El correo electrónico debe tener al menos 3 caracteres'),
      password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(20, 'La contraseña debe tener menos de 20 caracteres'),
      confirmPassword: yup
        .string()
        .required('La contraseña es requerida')
        .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
    }),
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: schema,
  });

  const onSubmit = handleSubmit(async (data) => {
    const { confirmPassword: _, ...restOfData } = data;
    const trimmedData = Object.fromEntries(
      Object.entries(restOfData).map(([key, value]) => [key, value.trim()]),
    );
    try {
      setIsLoading(true);
      await axios.post('/api/register', trimmedData);
      toast.success('Cuenta creada con éxito');
      router.push('/iniciar-sesion');
    } catch (error) {
      console.error(error);
      if (
        error instanceof AxiosError &&
        error.response?.data.message === 'User already exists'
      ) {
        toast.error('El correo electrónico ya está en uso');
      } else {
        toast.error('Ha ocurrido un error al crear la cuenta', {
          autoClose: false,
        });
      }
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <div className="space-y-4">
        {REGISTER_FORM_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              className={clsx(
                'input',
                errors[field.name as RegisterFormDataKeys]?.message && 'error',
              )}
              placeholder={field.placeholder}
              autoComplete={field.autocomplete ? 'on' : 'off'}
              // autoFocus={field.name === 'firstName'}
              {...register(field.name as RegisterFormDataKeys)}
            />
            {errors[field.name as RegisterFormDataKeys] && (
              <small className="text-error">
                {errors[field.name as RegisterFormDataKeys]?.message}
              </small>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <button className="btn btn-primary" disabled={isLoading}>
          Crear cuenta
        </button>
        <Link href={'/iniciar-sesion'} className="btn btn-plain">
          Iniciar sesión
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
