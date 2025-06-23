import React, { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { Link, useParams } from "react-router-dom";
import {
  useOrderDetailsQuery,
  useUpdateOrderMutation,
} from "../../redux/api/OrderAPI";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const Update_Order = () => {
  const params = useParams();
  const [status, setStatus] = useState("");

  const { data } = useOrderDetailsQuery(params?.id);
  const [updateOrder, { error, isSuccess, isLoading }] =
    useUpdateOrderMutation();
  console.log(data);

  const order = data?.order || {};

  // Destructure relevant fields from the order object
  const {
    paymentInfo,
    paymentMethod,
    totalAmount,
    orderItems,
    shippingInfo,
    shippingAmount,
    user,
    orderStatus,
    taxAmount,
    itemsPrice,
  } = order;

  useEffect(() => {
    if (isSuccess) {
      toast.success("Order status updated");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (orderStatus) {
      setStatus(orderStatus);
    }
  }, [error, orderStatus]);

  const isPaid = paymentInfo?.status === "paid" ? true : false;

  const handleOrderStatus = (id) => {
    const data = { status };
    updateOrder({ id, body: data });
  };

  return (
    <>
      <MetaData title={"Order Details"} />
      <AdminLayout>
        <div class="row d-flex justify-content-around">
          <div class="col-12 col-lg-8 order-details">
            <h3 class="mt-5 mb-4">Order Details</h3>

            <table class="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th scope="row">ID</th>
                  <td>{order?._id}</td>
                </tr>
                <tr>
                  <th scope="row">Status</th>
                  <td
                    class={
                      String(orderStatus).includes("Delivered")
                        ? "greenColor"
                        : "redColor"
                    }
                  >
                    <b>{orderStatus}</b>
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 class="mt-5 mb-4">Shipping Info</h3>
            <table class="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th scope="row">Name</th>
                  <td>{user?.name}</td>
                </tr>
                <tr>
                  <th scope="row">Phone No</th>
                  <td>{shippingInfo?.phoneNo}</td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>
                    {" "}
                    {shippingInfo?.address}, {shippingInfo?.city},{" "}
                    {shippingInfo?.country}, {shippingInfo?.postalCode}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 class="mt-5 mb-4">Payment Info</h3>
            <table class="table table-striped table-bordered">
              <tbody>
                <tr>
                  <th scope="row">Status</th>
                  <td class={isPaid ? "greenColor" : "redColor"}>
                    <b>{paymentInfo?.status}</b>
                  </td>
                </tr>
                <tr>
                  <th scope="row">Method</th>
                  <td>{paymentMethod}</td>
                </tr>
                <tr>
                  <th scope="row">Stripe ID</th>
                  <td>{paymentInfo?.id || "nill"}</td>
                </tr>
                <tr>
                  <th scope="row">Amount</th>
                  <td>${itemsPrice}</td>
                </tr>
              </tbody>
            </table>

            <h3 class="mt-5 my-4">Order Items:</h3>

            <hr />
            <div
              className="table-responsive"
              style={{ maxHeight: "300px", overflowX: "auto" }}
            >
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems?.map((order) => (
                    <tr key={order._id || order.name}>
                      <td>
                        <img
                          src={order?.image}
                          alt={order?.name}
                          height="50"
                          width="70"
                          style={{ objectFit: "cover" }}
                        />
                      </td>
                      <td>
                        {order?.name
                          ? order.name.length > 20
                            ? order.name.substring(0, 20) + "..."
                            : order.name
                          : ""}
                      </td>

                      <td>${order?.price}</td>
                      <td>{order?.quantity} Piece(s)</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr />
          </div>

          <div class="col-12 col-lg-3 mt-lg-5">
            <h4 class="my-4">Status</h4>

            <div class="mb-3">
              <select
                class="form-select"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            <button
              class="btn btn-primary w-100"
              onClick={() => handleOrderStatus(order?._id)}
              disabled={isLoading}
            >
              Update Status
            </button>

            <h4 class="mt-5 mb-3">Order Invoice</h4>
            <Link
              to={`/invoice/order/${order?._id}`}
              class="btn btn-success w-100"
            >
              <i class="fa fa-print"></i> Generate Invoice
            </Link>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default Update_Order;
