import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { loginApi } from "./apiAuth";
import { useAuthStore } from "../../store/authStore";

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => loginApi(data.email, data.password),

    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      navigate("/products");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "An error occurred. Please try again!");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    setErrorMessage(null);
    loginMutation.mutate(data);
  };

  return (
    <div className="">
      <h2>Login</h2>
      {errorMessage && <div>{errorMessage}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            {...register("email", { required: "Please fill email!" })}
            placeholder="example@email.com"
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            {...register("password", { required: "Please fill password" })}
            placeholder="............"
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? "Processing..." : "Login"}
        </button>
      </form>
    </div>
  );
};
