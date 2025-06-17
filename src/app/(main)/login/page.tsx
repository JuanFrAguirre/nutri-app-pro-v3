import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <div className="space-y-10">
      <p className="title">Iniciar sesión</p>
      <p className="subtitle">
        Iniciá sesión para comenzar a trackear tu nutrición
      </p>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
