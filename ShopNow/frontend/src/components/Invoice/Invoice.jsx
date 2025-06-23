import React, { useEffect } from "react";
import logo from "../../assets/logo.png"; // Make sure this path is correct
import "./Invoice.css";
import { useOrderDetailsQuery } from "../../redux/api/OrderAPI";
import { useParams } from "react-router-dom";
import Loader from "../layout/Loader";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";

const Invoice = () => {
  const params = useParams();
  const { data, isLoading, error } = useOrderDetailsQuery(params?.id);

  const order = data?.order || {};

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [error]);

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

  //handle download invoice
  const handleDownload = () => {
    const input = document.getElementById("order_invoice"); // Step 1: Get the HTML element that contains the invoice content

    html2canvas(input).then((canvas) => {
      // Step 2: Convert the HTML content into a canvas image
      const imgData = canvas.toDataURL("image/png"); // Step 3: Get the image data in PNG format

      const pdf = new jsPDF(); // Step 4: Create a new PDF document

      const pdfWidth = pdf.internal.pageSize.getWidth(); // Step 5: Get the PDF's width

      // Step 6: Add the image to the PDF. Note: height is currently set to 0
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, 0);

      pdf.save(`invoice_${order?._id}.pdf`); // Step 7: Save the PDF file with a dynamic filename
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="container my-5">
      <div className="row justify-content-center mb-4">
        <div className="col-md-5 text-center">
          <button className="btn btn-success w-100" onClick={handleDownload}>
            <i className="fa fa-print me-2"></i> Download Invoice
          </button>
        </div>
      </div>

      <div id="order_invoice" className="p-4 border rounded shadow-sm bg-white">
        <header className="mb-4">
          <div className="text-center">
            <img
              src={logo}
              alt="Company Logo"
              style={{ maxWidth: "250px", height: "auto" }}
            />
          </div>
          <h4 className="text-center bg-secondary text-light py-2">
            INVOICE #{order?._id}
          </h4>

          <div className="row mt-4">
            <div className="col-md-6 mb-3">
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>Phone:</strong> {shippingInfo?.phoneNo}
              </p>
              <p>
                <strong>Address:</strong>
                {shippingInfo?.address}, {shippingInfo?.city},{" "}
                {shippingInfo?.country}, {shippingInfo?.postalCode}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order?.createdAt).toLocaleString("en-US")}
              </p>
              <div>
                <strong>Status:</strong>{" "}
                <span className={isPaid ? "greenColor" : "redColor"}>
                  {paymentInfo?.status}
                </span>
              </div>
            </div>

            <div className="col-md-6 text-md-end">
              <p>
                <strong>ShopNa</strong>
              </p>
              <p>
                248 Earty,
                <br />
                Mulawin, Tanza
              </p>
              <p>(09) 519-0450</p>
              <p>
                <a href="mailto:info@shopit.com">info@shopNa.com</a>
              </p>
            </div>
          </div>
        </header>

        <main>
          <table className="table table-bordered table-striped mt-4">
            <thead className="table-secondary">
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>QTY</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={item?._id || index}>
                  <td>{index + 1}</td> 
                  <td>{item?._id}</td> 
                  <td>{item?.name}</td>
                  <td>{item?.price}</td>
                  <td>{item?.quantity}</td>
                  <td>{(item?.quantity * item?.price).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>SUBTOTAL</strong>
                </td>
                <td>$ {itemsPrice.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>TAX 15%</strong>
                </td>
                <td>$ {taxAmount.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>SHIPPING</strong>
                </td>
                <td>$ {shippingAmount.toFixed(2)}</td>
              </tr>
              <tr className="table-dark">
                <td colSpan="5" className="text-end">
                  <strong>GRAND TOTAL</strong>
                </td>
                <td>
                  <strong>$ {totalAmount.toFixed(2)}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </main>

        <footer className="text-center text-muted mt-5">
          Invoice was created on a computer and is valid without the signature.
        </footer>
      </div>
    </div>
  );
};

export default Invoice;
