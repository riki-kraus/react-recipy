import { useContext } from "react";
import { user } from "../Types";
import axios from "axios";
import { userContext } from "./userContext";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "../styles/signin.css";

const schema = yup.object().shape({
  UserName: yup.string().required("יש להזין שם משתמש"),
  Password: yup.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים").required("יש להזין סיסמה"),
});

const Login = () => {
  const { setMyUser } = useContext(userContext);
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSend = async (data: any) => {
    try {
      const res = await axios.post<user>("http://localhost:8080/api/user/login", data);
      setMyUser(res.data);
      nav("/ShowRecipes");
    } catch (error: any) {
      if (error.response?.data) {
        setError("UserName", { message: error.response.data });
      } else {
        setError("UserName", { message: "Login failed, please try again." });
      }
    }
  };

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit(onSend)}>
        <h2>התחברות</h2>
        <input {...register("UserName")} placeholder="שם משתמש" />
        <p>{errors.UserName?.message}</p>
        <input type="password" {...register("Password")} placeholder="סיסמה" />
        <p>{errors.Password?.message}</p>
        <button type="submit" disabled={!isValid}>
          התחבר
        </button>
        {errors.UserName?.message === "user not found!" && (
          <Link to="/SighIn">להרשמה הקליקו כאן👇</Link>
        )}
      </form>
    </div>
  );
};

export default Login;
