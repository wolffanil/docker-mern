import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "../../components/ui/FormStyles";
import { SignupValidation } from "../../libs/validation";
import { useSignUpAccount } from "../../libs/react-query/reactQueriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const { setUser, setIsAuthenticated } = useAuthContext();

  const { mutate: signUp, isPending: isSignUpLoading } = useSignUpAccount();

  const handleRegister = async (value: z.infer<typeof SignupValidation>) => {
    const id = toast.loading("Загрузка...");

    await signUp(value, {
      onSuccess: (user) => {
        toast.success("Вы успешно зарегестрировались", {
          id,
        });
        setUser(user);
        setIsAuthenticated(true);
        navigate("/");
      },
      onError: (message) => {
        const messageError = errorMessage(message);
        if (messageError === null) return;
        toast.error("Ошибка: " + messageError, {
          id,
        });
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleRegister)}>
      <h1 className="form__title form__title--mt0">
        CОЗДАЙТЕ НОВУЮ УЧЕТНУЮ ЗАПИСЬ
      </h1>

      <h2 className="form__subtitle">
        Чтобы воспользоваться <span className="form__title">ДЕБИЛОГРАММ</span> ,
        <br /> пожалуйста, введите свои данные.
      </h2>

      <div className="form__wrapper">
        <label className="form__label">Имя</label>
        <input
          type="text"
          {...register("name")}
          className="form__input"
          disabled={isSignUpLoading}
        />
        {errors.name && errors.name.message && (
          <p className="form__error">{errors.name.message}</p>
        )}
      </div>

      <div className="form__wrapper">
        <label className="form__label">E-mail</label>
        <input
          type="email"
          {...register("email")}
          className="form__input"
          disabled={isSignUpLoading}
        />
        {errors.email && errors.email.message && (
          <p className="form__error">{errors.email.message}</p>
        )}
      </div>

      <div className="form__wrapper">
        <label className="form__label">Пароль</label>
        <input
          type="password"
          {...register("password")}
          className="form__input"
          disabled={isSignUpLoading}
        />
        {errors.password && errors.password.message && (
          <p className="form__error">{errors.password.message}</p>
        )}
      </div>

      <button className="form__button" type="submit" disabled={isSignUpLoading}>
        Создать
      </button>

      <p className="form__link">
        Ecть аккаунт?{" "}
        <Link to="/signin" className="form__link--violet">
          Войти
        </Link>
      </p>
    </Form>
  );
}

export default Register;
