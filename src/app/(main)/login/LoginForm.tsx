'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as yup from 'yup';

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormDataKeys = 'email' | 'password';

const LOGIN_FORM_FIELDS = [
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
];

const LoginForm = () => {
  const { isLoading, setIsLoading } = useLoadingContext();
  const schema = yupResolver(
    yup.object().shape({
      email: yup
        .string()
        .email('El correo electrónico no es válido')
        .required('El correo electrónico es requerido'),
      password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(20, 'La contraseña debe tener menos de 20 caracteres'),
    }),
  );

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: schema,
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      setIsLoading(true);
      await axios.post('/api/login', data);
      router.push('/');
    } catch (error) {
      console.error(error);
      toast.error('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <form className="space-y-10" onSubmit={onSubmit}>
      <div className="space-y-4">
        {LOGIN_FORM_FIELDS.map((field) => (
          <div key={field.name} className="flex flex-col gap-2">
            <label htmlFor={field.name} className="label">
              {field.label}
            </label>
            <input
              id={field.id}
              type={field.type}
              className={clsx(
                'input',
                errors[field.name as LoginFormDataKeys]?.message && 'error',
              )}
              placeholder={field.placeholder}
              autoComplete={field.autocomplete ? 'on' : 'off'}
              {...register(field.name as LoginFormDataKeys)}
            />
            {errors[field.name as LoginFormDataKeys] && (
              <small className="text-error">
                {errors[field.name as LoginFormDataKeys]?.message}
              </small>
            )}
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-5">
        <button className="btn btn-primary" disabled={isLoading}>
          Iniciar sesión
        </button>
        <Link href={'/register'} className="btn">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
