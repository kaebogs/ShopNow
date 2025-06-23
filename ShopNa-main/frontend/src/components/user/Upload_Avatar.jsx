import React from "react";
import { useState, useEffect } from "react";
import UserLayout from "../layout/UserLayout";
import default_image from "../../assets/default_avatar.jpg";
import { useUploadAvatarMutation } from "../../redux/api/UserAPI";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Upload_Avatar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : default_image
  );

  const [uploadAvatar, { isSuccess, error, isLoading }] =
    useUploadAvatarMutation();

  useEffect(() => {
    if (error && error.data?.message) {
      toast.error(error.data.message);
    }

    if (isSuccess) {
      toast.success("Avatar Uploaded");
      navigate("/user/profile");
    }
  }, [error, isSuccess]);

  //handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = { avatar };

    console.log(userData);

    uploadAvatar(userData);
  };

  // Handle file input change event
  const onChange = (e) => {
    const reader = new FileReader(); // Create a new FileReader instance to read the selected file

    reader.onload = () => {
      if (reader.readyState === 2) {
        // When the file has been read successfully
        setAvatarPreview(reader.result); // Update the avatar preview state with the file's data URL
        setAvatar(reader.result); // Store the file's data URL in the avatar state
      }
    };

    reader.readAsDataURL(e.target.files[0]); // Read the selected file as a Data URL (Base64)
  };

  return (
    <UserLayout>
      <div className="row d-flex align-items-center justify-content-center min-vh-75 py-5 bg-light">
        <div className="col-12 col-md-8 col-lg-6">
          <form
            className="shadow-lg rounded-3 bg-white p-5 p-lg-4"
            onSubmit={handleSubmit}
          >
            <h2 className="mb-5 text-center fw-bold text-dark">
              Upload Avatar
            </h2>

            <div className="mb-4 text-center">
              <figure
                className="avatar mx-auto"
                style={{ width: "130px", height: "130px" }}
              >
                <img
                  src={avatarPreview}
                  className="rounded-circle border border-4 border-dark"
                  alt="User Avatar"
                  width="130"
                  height="130"
                  style={{ objectFit: "cover" }}
                />
              </figure>
            </div>

            <div className="mb-4 text-center">
              <label className="form-label fw-semibold" htmlFor="customFile">
                Choose Avatar
              </label>
              <input
                type="file"
                name="avatar"
                className="form-control fs-6 form-control-lg"
                id="customFile"
                accept="image/*"
                onChange={onChange}
              />
            </div>

            <button
              id="register_button"
              type="submit"
              className="btn btn-dark w-100 py-2 fw-semibold fs-6"
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default Upload_Avatar;
