import React from "react";
import { useMyOrdersQuery } from "../../redux/api/OrderAPI";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearCart } from "../../redux/features/CartSlice";
import { useDispatch } from "react-redux";
import Loader from "../layout/Loader";
import MyOrderActions from "./MyOrderActions";
import MetaData from "../layout/MetaData";

const MyOrders = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, error, isLoading } = useMyOrdersQuery();

  const orderSuccess = searchParams.get("order_success");

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/order");
    }
  }, [error, orderSuccess]);

  const setOrders = () => {
    const myOrder = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amountPaid",
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
      myOrder.rows.push({
        id: order?._id,
        amountPaid: `$${order?.totalAmount}`,
        paymentStatus: order?.paymentInfo?.status.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <div className="d-none d-lg-flex gap-2">
              <Link
                to={`/me/order/${order?._id}`}
                className="btn btn-primary me-2"
              >
                <i className="fa-solid fa-eye"></i>
              </Link>
              <Link
                to={`/invoice/order/${order?._id}`}
                className="btn btn-success"
              >
                <i className="fa-solid fa-print"></i>
              </Link>
            </div>
            <MyOrderActions order={order} className="d-block d-lg-none" />
          </>
        ),
      });
    });

    return myOrder;
  };

  if (isLoading) {
    return;
    <Loader />;
  }

  return (
    <>
      <MetaData title={"My Orders"} />
      <div>
        <h1 className="my-lg-5 my-3 text-center">
          {data?.orders?.length} Orders
        </h1>

        <div style={{ overflowX: "auto" }}>
          <MDBDataTable
            className="px-3"
            data={setOrders()}
            striped
            bordered
            hover
            responsive={false} 
          />
        </div>
      </div>
    </>
  );
};

export default MyOrders;
