import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { registerApi } from "./apiAuth";
import { useAuthStore } from "../../store/authStore";

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerApi(data.email, data.password, data.name),

    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      navigate("/products");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const backendMessage = error.response?.data?.message;
      setErrorMessage(backendMessage || "An error occurred. Please try again");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    setErrorMessage(null);
    registerMutation.mutate(data);
  };

  return (
    <div>
      <h2>Register</h2>
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
            {...register("password", {
              required: "Please fill password!",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
            placeholder="........."
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="name">User name</label>
          <input
            type="text"
            {...register("name", { required: "Please fill user name!" })}
            placeholder="John Than"
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <button type="submit" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? "Processing..." : "Register"}
        </button>
      </form>
    </div>
  );
};
