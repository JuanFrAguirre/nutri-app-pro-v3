import PageWrapper from '@/components/PageWrapper';
import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <PageWrapper>
      <p className="title">Iniciar sesión</p>
      <p className="subtitle">
        Iniciá sesión para comenzar a trackear tu nutrición
      </p>
      <LoginForm />
    </PageWrapper>
  );
};

export default LoginPage;
