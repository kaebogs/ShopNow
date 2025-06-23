import React, { useEffect, useState } from "react";
import { useRegisterMutation } from "../../redux/api/AuthAPI";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";

const Register = () => {
  // State to store user input (name, email, password)
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Destructure values from user state for easy access
  const { name, email, password } = user;
  const navigate = useNavigate();

  const [register, { error, data, isLoading }] = useRegisterMutation();

  const {isAuthenticated} = useSelector((state) => state.auth);

  useEffect(() => {
    if(isAuthenticated){
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  }, [error, isAuthenticated]);

  console.log(data);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
    };
    register(userData);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
     <MetaData title={"Register"} />
      <div className="row d-flex justify-content-center align-content-center mt-5">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body p-4"
            onSubmit={handleSubmit}
            style={{ maxWidth: "450px", margin: "auto" }}
          >
            <h2 className="mb-4">Register</h2>

            <div className="mb-3">
              <label htmlFor="name_field" className="form-label">
                Name
              </label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={handleChange}
              />
            </div>

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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-success w-100 mt-2 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Register"}
            </button>

            <div className="my-3">
              <Link to="/login" className="float-end">
                Login?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
