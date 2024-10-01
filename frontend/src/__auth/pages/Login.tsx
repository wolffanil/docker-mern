import { useForm } from "react-hook-form";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { Form } from "../../components/ui/FormStyles";
import { SigninValidation } from "../../libs/validation";
import { useSignInAccount } from "../../libs/react-query/reactQueriesAndMutations";
import { useAuthContext } from "../../context/AuthContext";
import { errorMessage } from "../../libs/errorMessage";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const { setUser, setIsAuthenticated } = useAuthContext();

  const { isPending: isSignInLoading, mutate: signIn } = useSignInAccount();

  const handleLogin = async (value: z.infer<typeof SigninValidation>) => {
    const id = toast.loading("Загрузка...");

    await signIn(value, {
      onSuccess: (user) => {
        toast.success(`Добро пожаловать обратно ${user.name}`, {
          id,
        });

        setUser({
          id: user.id,
          name: user.name,
          username: user?.username || "",
          email: user.email,
          isOnline: user.isOnline,
          bio: user?.bio || "",
          photoProfile: user.photoProfile,
          createdAt: user.createdAt,
        });
        setIsAuthenticated(true);
        navigate("/");
      },
      onError: (error) => {
        const messageError = errorMessage(error);
        toast.error("Ошибка: " + messageError, {
          id,
        });
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleLogin)}>
      <H1>
        <img src="/logo.svg" alt="logo" />
        ДЕБИЛГРАММ
      </H1>
      <h2 className="form__title">Войдите в свою учётную запись</h2>

      <p className="form__subtitle">
        Добро пожаловать! Пожалуйста, введите свои данные.
      </p>

      <div className="form__wrapper">
        <label className="form__label">Email</label>
        <input
          type="text"
          {...register("email")}
          className="form__input"
          disabled={isSignInLoading}
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
          disabled={isSignInLoading}
        />

        {errors.password && errors.password.message && (
          <p className="form__error">{errors.password.message}</p>
        )}
      </div>

      <button className="form__button" type="submit" disabled={isSignInLoading}>
        Войти
      </button>
      <p className="form__link">
        У вас нет учетной записи?{" "}
        <Link to="/signup" className="form__link--violet">
          Создать
        </Link>
      </p>
    </Form>
  );
}

const H1 = styled.h1`
  display: flex;
  column-gap: 35px;
  color: var(--violet-color);
  font-size: 50px;
`;

export default Login;
