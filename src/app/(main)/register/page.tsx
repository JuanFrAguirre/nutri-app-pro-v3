import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  return (
    <main className="container px-5 py-10 md:pb-30">
      <div className="grid place-items-center grow">
        <div className="space-y-10">
          <p className="title">Crear cuenta</p>
          <p className="subtitle">
            Creá tu cuenta para comenzar a trackear tu nutrición
          </p>
          <RegisterForm />
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
