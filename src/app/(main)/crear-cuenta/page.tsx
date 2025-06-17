import PageWrapper from '@/components/PageWrapper';
import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  return (
    <PageWrapper>
      <p className="title">Crear cuenta</p>
      <p className="subtitle">
        Creá tu cuenta para comenzar a trackear tu nutrición
      </p>
      <RegisterForm />
    </PageWrapper>
  );
};

export default RegisterPage;
