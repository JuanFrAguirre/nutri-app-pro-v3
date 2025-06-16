import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <main className="container px-5 py-10 md:pb-30">
      <div className="grid place-items-center grow">
        <div className="space-y-10">
          <p className="title">Iniciar sesión</p>
          <p className="subtitle">
            Iniciá sesión para comenzar a trackear tu nutrición
          </p>
          <LoginForm />
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
