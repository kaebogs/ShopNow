import React from "react";
import { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../redux/api/UserAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const params = useParams();

  const [resetPassword, { isLoading, error, isSuccess }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Reset password successfull!");
      navigate("/login");
    }
  }, [isAuthenticated, error, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      password,
      confirmPassword,
    };

    resetPassword({
      token: params?.token,
      body: userData,
    });
  };

  return (
    <>
      <div className="row d-flex align-items-center justify-content-center mt-5">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body p-4"
            action="your_submit_url_here"
            method="post"
            onSubmit={handleSubmit}
          >
            <h2 className="mb-4">New Password</h2>

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
              />
            </div>

            <div className="mb-3">
              <label for="confirm_password_field" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                name="confirm_password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Setting up..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
