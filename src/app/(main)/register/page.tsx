import RegisterForm from './RegisterForm';

const RegisterPage = () => {
  return (
    <div className="space-y-10">
      <p className="title">Crear cuenta</p>
      <p className="subtitle">
        Creá tu cuenta para comenzar a trackear tu nutrición
      </p>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
