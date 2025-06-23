import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForgotPasswordMutation } from "../../redux/api/UserAPI";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const [forgotPassword, { isSuccess, error, isLoading }] =
    useForgotPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Email sent. Check your inbox.");
    }
  }, [error, isSuccess, isAuthenticated]);

  const handelSubmit = (e) => {
    e.preventDefault();

    forgotPassword({email})
  }

  return (
    <div className="row d-flex align-items-center justify-content-center mt-5">
      <div className="col-10 col-md-6 col-lg-4">
        <form className="shadow p-4 rounded bg-white" onSubmit={handelSubmit}>
          <h2 className="mb-3 text-center">Forgot Password</h2>
          <p className="text-muted text-center mb-4">
            Enter your email to receive password reset instructions.
          </p>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-success w-100 py-2" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
