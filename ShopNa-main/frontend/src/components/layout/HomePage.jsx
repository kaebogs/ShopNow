import React, { useEffect } from "react";
import MetaData from "../layout/MetaData";
import { useGetProductsQuery } from "../../redux/api/ProductAPI";
import ProductItem from "../products/ProductItem";
import Loader from "./Loader";
import toast from "react-hot-toast";
import CustomPagination from "./CustomPagination";
import { useSearchParams } from "react-router-dom";
import Filters from "./Filters";
import Search from "./Search";

const HomePage = () => {
  let [searchParams] = useSearchParams();
  // for params
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const rating = searchParams.get("ratings");

  const params = { page, keyword }; // this is use to create an object to hold the parameters for the API query

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  rating !== null && (params.rating = rating);

  const { data, error, isLoading, isError } = useGetProductsQuery(params);

  console.log(data, error, isLoading, isError);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, []);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Product"} />
      <div className="row overflow-y-auto">
        {keyword && (
          <>
            <div className="col-6 col-md-3 d-none d-xl-block mt-5 overflow-y-auto">
              <Filters />
            </div>
            <div
              className="offcanvas w-75 offcanvas-end d-xl-none"
              tabIndex="-1"
              id="offcanvasRight"
              aria-labelledby="offcanvasRightLabel"
            >
              <div className="offcanvas-header">
                <button
                  type="button"
                  className="btn-close text-reset"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <Filters />
            </div>
          </>
        )}

        <div className={keyword ? "col-12 col-xl-9" : "col-12"}>
          <Search className="d-flex justify-content-center m-auto mt-3 d-lg-none w-75" />
           <div className="position-relative mt-2 mb-1 mb-lg-4 py-4 text-lg-center">
          <h2 className="fw-bold m-0">{keyword
              ? `${data?.products?.length} Products found: ${keyword}`
              : " Latest Products"}</h2>
          {keyword ? (
              <button
            className="btn btn-dark d-xl-none position-absolute top-50 end-0 translate-middle-y"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
          >
           <i class="fa-solid fa-filter d-xl-none"></i>
          </button> 
          ): ""}
        </div>

          <section id="products" className="mt-5 container">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem
                  product={product}
                  key={product?._id}
                  columnSize={columnSize}
                />
              ))}
            </div>
          </section>

          <CustomPagination
            resPerPage={data?.resPerPage}
            filteredProducts={data?.filteredProducts}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
