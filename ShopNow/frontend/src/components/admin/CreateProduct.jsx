import React from "react";
import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import { useCreateProductsMutation } from "../../redux/api/ProductAPI";
import { PRODUCT_CATEGORY } from "../../constants/constants";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";

const CreateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category:  PRODUCT_CATEGORY[0],
    seller: "",
  });

  const navigate = useNavigate();

  const { name, description, price, stock, category, seller } = product;

  const [createProducts, { isLoading, error, isSuccess }] =
    useCreateProductsMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product created");
      navigate("/admin/products");
    }
  }, [error, isSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();

    createProducts(product);
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Create Product"} />
      <AdminLayout>
        {" "}
        <div className="row d-flex align-items-center justify-content-center">
          <div className="col-12 col-lg-10 mt-5 mt-lg-0">
            <form
              className="shadow-lg rounded bg-body p-4 p-lg-5"
              onSubmit={handleSubmit}
            >
              <h2 className="mb-4 fw-bold text-center">New Product</h2>
              <div className="mb-3">
                <label for="name_field" className="form-label fw-bold">
                  {" "}
                  Name{" "}
                </label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control input-color p-2"
                  name="name"
                  value={name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label for="description_field" className="form-label fw-bold">
                  Description
                </label>
                <textarea
                  className="form-control input-color p-2"
                  id="description_field"
                  rows="8"
                  name="description"
                  value={description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="row">
                <div className="mb-3 col">
                  <label for="price_field" className="form-label fw-bold">
                    {" "}
                    Price{" "}
                  </label>
                  <input
                    type="text"
                    id="price_field"
                    className="form-control input-color p-2"
                    name="price"
                    value={price}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3 col">
                  <label for="stock_field" className="form-label fw-bold">
                    {" "}
                    Stock{" "}
                  </label>
                  <input
                    type="number"
                    id="stock_field"
                    className="form-control input-color p-2"
                    name="stock"
                    value={stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="mb-3 col">
                  <label for="category_field" className="form-label fw-bold">
                    {" "}
                    Category{" "}
                  </label>
                  <select
                    className="form-select input-color p-2"
                    id="category_field"
                    name="category"
                    value={category}
                    onChange={handleChange}
                  >
                    {PRODUCT_CATEGORY.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3 col">
                  <label for="seller_field" className="form-label fw-bold">
                    {" "}
                    Seller Name{" "}
                  </label>
                  <input
                    type="text"
                    id="seller_field"
                    className="form-control input-color p-2"
                    name="seller"
                    value={seller}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-success w-100 mt-3 p-2 fw-semibold fs-5"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </form>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default CreateProduct;
