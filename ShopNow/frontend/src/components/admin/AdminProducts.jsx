import { useEffect } from "react";
import toast from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import {
  useDeleteProductMutation,
  useGetAdminProductsQuery,
} from "../../redux/api/ProductAPI";
import AdminLayout from "../layout/AdminLayout";
import Loader from "../layout/Loader";
import ProductActions from "../adminActionBtn/ProductActions";
import MetaData from "../layout/MetaData";

const AdminProducts = () => {
  const { data, error, isLoading } = useGetAdminProductsQuery();

  const [
    deleteProduct,
    { error: deleteError, isLoading: deleteLoading, isSuccess },
  ] = useDeleteProductMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (deleteError) {
      toast.error(error?.data?.message);
    }

    if (isSuccess) {
      toast.success("Product deleted");
    }
  }, [error, deleteError, isSuccess]);

  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name?.substring(0, 20)}...`,
        stock: product?.stock,
        actions: (
          <>
            <div className="d-none d-lg-flex gap-2">
              <Link
                to={`/admin/product/${product?._id}`}
                className="btn btn-outline-primary ms-2"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <Link
                to={`/admin/product/${product?._id}/upload_images`}
                className="btn btn-outline-success ms-2"
              >
                <i className="fa fa-image"></i>
              </Link>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => handleDeleteProduct(product?._id)}
                disabled={deleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>

            <ProductActions
              product={product}
              handleDeleteProduct={handleDeleteProduct}
              deleteLoading={deleteLoading}
              className="d-block d-lg-none"
            />
          </>
        ),
      });
    });

    return products;
  };

  const handleDeleteProduct = (id) => {
    deleteProduct(id);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={"All Products"} />
      <AdminLayout>
        <div className="my-lg-5 my-2 text-center ">
          <h1 className="text-2xl font-semibold">
            {data?.products?.length} Products
          </h1>
        </div>

        <div className="overflow-x-auto">
          <MDBDataTable
            className="min-w-[600px] md:min-w-full px-3"
            data={setProducts()}
            striped
            bordered
            hover
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminProducts;
