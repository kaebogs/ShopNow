import React, { useEffect } from "react";
import { useOrderDetailsQuery } from "../../redux/api/OrderAPI";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Loader from "../layout/Loader";
import toast from "react-hot-toast";
import MetaData from "../layout/MetaData";

const OrderDetails = () => {
  const params = useParams();

  const { data, error, isLoading } = useOrderDetailsQuery(params?.id);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

  if (isLoading) return <Loader />;

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

  console.log(order);

  const isPaid = paymentInfo?.status === "paid" ? true : false;

  return (
    <>
      <MetaData title={"Order Details"} />
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9 mt-5 order-details">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mt-5 mb-4">Your Order Details</h3>
            <Link
              className="btn btn-success"
              to={`/invoice/order/${order?._id}`}
            >
              <i className="fa fa-print"></i> Invoice
            </Link>
          </div>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{order?._id}</td>
              </tr>
              <tr>
                <th scope="row">Status</th>
                <td
                  className={
                    String(orderStatus).includes("Delivered")
                      ? "greenColor"
                      : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </td>
              </tr>
              <tr>
                <th scope="row">Date</th>
                <td>{new Date(order?.createdAt).toLocaleString("en-US")}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Shipping Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Name</th>
                <td>{user?.name}</td>
              </tr>
              <tr>
                <th scope="row">Phone No</th>
                <td>{shippingInfo?.phoneNo}0</td>
              </tr>
              <tr>
                <th scope="row">Address</th>
                <td>
                  {shippingInfo?.address}, {shippingInfo?.city},{" "}
                  {shippingInfo?.country}, {shippingInfo?.postalCode}
                </td>
              </tr>
              <tr>
                <th scope="row">Shipping Amount</th>
                <td>$ {shippingAmount}</td>
              </tr>
              <tr>
                <th scope="row">Tax</th>
                <td>$ {taxAmount}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 mb-4">Payment Info</h3>
          <table className="table table-striped table-bordered">
            <tbody>
              <tr>
                <th scope="row">Status</th>
                <td className={isPaid ? "greenColor" : "redColor"}>
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
                <th scope="row">Total Price of Items</th>
                <td>$ {itemsPrice}</td>
              </tr>
              <tr>
                <th scope="row">Amount Paid</th>
                <td>{`$ ${totalAmount}`}</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-5 my-4">Order Items:</h3>

          <hr />
          <div className="cart-item my-1">
            {orderItems?.map((item) => (
              <div className="row my-5">
                <div className="col-4 col-lg-2">
                  <img
                    src={item?.image}
                    alt={item?.name}
                    height="45"
                    width="65"
                  />
                </div>

                <div className="col-5 col-lg-5">
                  <Link to={`/product/${item?.product}`}>{item?.name}</Link>
                </div>

                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                  <p>{`$ ${item?.price}`}</p>
                </div>

                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                  <p>{`${item?.quantity} Piece(s)`}</p>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
