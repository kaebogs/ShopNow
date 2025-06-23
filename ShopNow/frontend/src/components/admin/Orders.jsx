import { useEffect } from "react";
import toast from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Loader from "../layout/Loader";
import {
  useDeleteOrderMutation,
  useGetAdminOrdersQuery,
} from "../../redux/api/OrderAPI";
import OrderActions from "../adminActionBtn/OrderActions";
import MetaData from "../layout/MetaData";

const Orders = () => {
  const { data, error, isLoading } = useGetAdminOrdersQuery();
  const [
    deleteOrder,
    { isLoading: deleteLoading, error: deleteError, isSuccess },
  ] = useDeleteOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (deleteError) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("Order deleted");
    }
  }, [error, deleteError, isSuccess]);

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
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

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <div className="d-none d-lg-flex gap-2">
              <Link
                to={`/admin/orders/${order?._id}`}
                className="btn btn-outline-primary"
              >
                <i className="fa fa-pencil"></i>
              </Link>
              <button
                className="btn btn-outline-danger ms-2"
                onClick={() => handleDeleteOrder(order?._id)}
                disabled={deleteLoading}
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>

            <OrderActions
              order={order}
              handleDeleteOrder={handleDeleteOrder}
              deleteLoading={deleteLoading}
              className="d-block d-lg-none"
            />
          </>
        ),
      });
    });

    return orders;
  };

  const handleDeleteOrder = (id) => {
    deleteOrder(id);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <MetaData title={"View Orders"} />
      <AdminLayout>
        <div className="my-lg-5 my-2 text-center">
          <h1 className="text-2xl font-semibold">
            {data?.orders?.length} Orders
          </h1>
        </div>

        <div className="overflow-x-auto">
          <MDBDataTable
            className="min-w-[600px] md:min-w-full px-3"
            data={setOrders()}
            striped
            bordered
            hover
          />
        </div>
      </AdminLayout>
    </>
  );
};

export default Orders;
