import React, { useEffect, useState } from "react";
import { useLoginMutation } from "../../redux/api/AuthAPI";
import { useGetUserQuery } from "../../redux/api/UserAPI";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { data, isLoading, error }] = useLoginMutation();

  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth); // to check if its authenticated

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); 
    }
    if (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  }, [error, isAuthenticated]);

  console.log(data);

  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    login(userData);
  };

  return (
    <>
      <MetaData title={"Login"} />
      <div className="row d-flex justify-content-center align-content-center mt-5">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body p-4"
            onSubmit={handleSubmit}
            style={{ maxWidth: "450px", margin: "auto" }}
          >
            <h2 className="mb-4">Login</h2>
            <div className="mb-3">
              <label htmlFor="email_field" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Link to="/forgot_password" className="float-end mb-4">
              Forgot Password?
            </Link>

            <button
              id="login_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "LOGIN"}
            </button>

            <div className="my-3">
              <Link to="/register" className="float-end">
                New User?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
