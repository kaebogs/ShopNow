import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SalesChart from "../charts/SalesChart";
import { useLazySalesDataQuery } from "../../redux/api/OrderAPI";
import toast from "react-hot-toast";
import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());

  const [salesData, { data, error, isLoading }] = useLazySalesDataQuery();

  // Automatically fetch sales data once if dates are valid and data isn't already loaded
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }

    if (startDate && endDate && !data) {
      salesData({
        startDate: new Date(startDate).toISOString(),
        endDate: endDate.toISOString(),
      });
    }
  }, [startDate, endDate, data, error]);

  //handle submit
  const handleSubmit = () => {
    salesData({
      startDate: new Date(startDate).toISOString(),
      endDate: endDate.toISOString(),
    });
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Admin Dashboard"} />
      <AdminLayout>
        <div className="d-flex flex-wrap align-items-end gap-3 mb-4">
          <div>
            <label className="form-label fw-semibold me-2">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              className="form-control shadow-sm"
            />
          </div>
          <div>
            <label className="form-label fw-semibold me-2">End Date</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              className="form-control shadow-sm"
            />
          </div>
          <div>
            <button
              className="btn btn-warning text-white fw-bold shadow-sm px-4 w-100 w-lg-25 w-100"
              onClick={handleSubmit}
            >
              Fetch
            </button>
          </div>
        </div>

        <div className="row g-4 my-lg-4 mb-3">
          <div className="col-xl-6 col-6">
            <div className="card text-light p-3 border-0 shadow h-100 bg-success">
              <div className="text-center">
                <h5 className="fw-lg-bold mb-2">Total Sales</h5>
                <p className="display-6 fw-lg-semibold text-light mb-0">
                  ${data?.totalSales.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="col-xl-6 col-6">
            <div className="card text-light p-3 border-0 shadow h-100 bg-danger">
              <div className="text-center">
                <h5 className="fw-lg-bold mb-2">Total Orders</h5>
                <p className="display-6 fw-lg-semibold text-light mb-0">
                  {data?.totalNumOrders}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <SalesChart salesData={data?.sales} />
      </AdminLayout>
    </>
  );
};

export default Dashboard;
