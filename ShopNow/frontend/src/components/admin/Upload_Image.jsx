import React from "react";
import AdminLayout from "../layout/AdminLayout";
import {
  useDeleteProductImageMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../redux/api/ProductAPI";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const Upload_Image = () => {
  const fileInput = useRef(null);
  const params = useParams();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadImages, setUploadImages] = useState([]);

  const { data } = useGetProductDetailsQuery(params?.id);
  const [deleteProductImage, { error: deleteError, isLoading: deleteLoading }] =
    useDeleteProductImageMutation();

  const [uploadProductImage, { error, isLoading, isSuccess }] =
    useUploadProductImageMutation();

  useEffect(() => {
    if (data?.product) {
      setUploadImages(data?.product?.images);
    }

    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(deleteError?.data?.message);
    }

    if (isSuccess) {
      setImagePreview([]);
      toast.success("Image Uploaded");
      navigate("/admin/products");
    }
  }, [data, error, isSuccess, deleteError]);

  // Handle file input change event
  const onChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((oldArray) => [...oldArray, reader.result]);
          setImages((oldArray) => [...oldArray, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  //handle delete image preview
  const handleDeleteImagePreview = (image) => {
    const filteredImage = imagePreview.filter((img) => img != image);
    setImages(filteredImage);
    setImagePreview(filteredImage);
  };

  // handle file input
  const handleFileInputRef = () => {
    if (fileInput.current) {
      fileInput.current.value = "";
    }
  };

  // handle upload image
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submitting if no images are selected
    if (imagePreview.length === 0) {
      toast.error("Please select a file");
      return;
    }
    uploadProductImage({ id: params?.id, body: { images } });
  };

  // handle Delte Image
  const handleDelete = (imgId) => {
    console.log("Deleting image:", imgId);
    deleteProductImage({ id: params?.id, body: { imgId } }).unwrap();
  };

  return (
    <>
      <MetaData title={"Upload image"} />
      <AdminLayout>
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-10 col-lg-8 mt-5 mt-lg-0">
            <form
              className="shadow rounded bg-body p-4"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <h2 className="mb-4">Upload Product Images</h2>

              <div className="mb-3">
                <label htmlFor="customFile" className="form-label">
                  Choose Images
                </label>
                <input
                  ref={fileInput}
                  type="file"
                  name="product_images"
                  className="form-control"
                  id="customFile"
                  multiple
                  onChange={onChange}
                  onClick={handleFileInputRef}
                />
              </div>

              {imagePreview.length > 0 && (
                <div className="new-images my-4">
                  <p className="text-warning">New Images:</p>
                  <div className="row mt-4">
                    {imagePreview.map((image) => (
                      <div className="col-md-3 mt-2">
                        <div className="card">
                          <img
                            src={image}
                            alt="New Preview"
                            className="card-img-top p-2"
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            onClick={() => handleDeleteImagePreview(image)}
                          >
                            <i className="fa fa-times"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uploaded Images */}
              {uploadImages.length > 0 && (
                <div className="uploaded-images my-4">
                  <p className="text-success">Product Uploaded Images:</p>
                  <div className="row mt-1">
                    {uploadImages.map((image) => (
                      <div className="col-md-3 mt-2" key={image.public_id}>
                        <div className="card">
                          <img
                            src={image?.url}
                            alt="Uploaded Preview"
                            className="card-img-top p-2"
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-block btn-danger cross-button mt-1 py-0"
                            style={{
                              backgroundColor: "#dc3545",
                              borderColor: "#dc3545",
                            }}
                            disabled={isLoading || deleteLoading}
                            onClick={() => handleDelete(image?.public_id)}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                id="register_button"
                type="submit"
                className="btn btn-primary w-100 py-2"
                disabled={isLoading || deleteLoading}
              >
                {isLoading ? "Uploading" : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Upload_Image;
