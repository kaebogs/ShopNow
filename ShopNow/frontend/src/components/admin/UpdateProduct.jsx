import React from "react";
import { useState, useEffect } from "react";
import AdminLayout from "../layout/AdminLayout";
import {
  useCreateProductsMutation,
  useGetProductDetailsQuery,
  useUpdateProductsMutation,
} from "../../redux/api/ProductAPI";
import { PRODUCT_CATEGORY } from "../../constants/constants";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from "../layout/MetaData";

const UpdateProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    seller: "",
  });

  const params = useParams();

  const navigate = useNavigate();

  const { name, description, price, stock, category, seller } = product;

  const [updateProducts, { isLoading, error, isSuccess }] =
    useUpdateProductsMutation();
  const { data } = useGetProductDetailsQuery(params?.id);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (data?.product) {
      setProduct({
        name: data?.product?.name,
        description: data?.product?.description,
        price: data?.product?.price,
        stock: data?.product?.stock,
        category: data?.product?.category,
        seller: data?.product?.seller,
      });
    }

    if (isSuccess) {
      toast.success("Product updated");
      navigate("/admin/products");
    }
  }, [error, isSuccess, data]);

  const handleSubmit = (e) => {
    e.preventDefault();

    updateProducts({ id: params?.id, body: product });
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Update Product"} />
      <AdminLayout>
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="card border-0 shadow rounded-4">
                <div className="card-body p-4 p-md-5 bg-light">
                  <h2 className="mb-4 text-center fw-bold text-dark">
                    Add New Product
                  </h2>

                  <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-3">
                      <label htmlFor="name_field" className="form-label">
                        Product Name
                      </label>
                      <input
                        type="text"
                        id="name_field"
                        className="form-control rounded-pill px-4"
                        name="name"
                        value={name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Description */}
                    <div className="mb-3">
                      <label htmlFor="description_field" className="form-label">
                        Description
                      </label>
                      <textarea
                        id="description_field"
                        className="form-control rounded-3 px-4"
                        name="description"
                        rows="5"
                        value={description}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    {/* Row for Price and Stock */}
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price_field" className="form-label">
                          Price
                        </label>
                        <input
                          type="text"
                          id="price_field"
                          className="form-control rounded-pill px-4"
                          name="price"
                          value={price}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mb-3 col-md-6">
                        <label htmlFor="stock_field" className="form-label">
                          Stock
                        </label>
                        <input
                          type="number"
                          id="stock_field"
                          className="form-control rounded-pill px-4"
                          name="stock"
                          value={stock}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Row for Category and Seller */}
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category_field" className="form-label">
                          Category
                        </label>
                        <select
                          id="category_field"
                          className="form-select rounded-pill px-4"
                          name="category"
                          value={category}
                          onChange={handleChange}
                        >
                          {PRODUCT_CATEGORY.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3 col-md-6">
                        <label htmlFor="seller_field" className="form-label">
                          Seller
                        </label>
                        <input
                          type="text"
                          id="seller_field"
                          className="form-control rounded-pill px-4"
                          name="seller"
                          value={seller}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid mt-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill py-2 fw-semibold"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating..." : "Submit Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UpdateProduct;
