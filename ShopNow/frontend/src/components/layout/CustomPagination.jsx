import { useNavigate, useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react";
import Pagination from "react-js-pagination"


const CustomPagination = ({resPerPage, filteredProducts}) => {

  const [currentPage, setCurrentPage] = useState()

  let [searchParams] = useSearchParams(); 
  const navigate = useNavigate()

  const page = Number(searchParams.get('page')) || 1 

  useEffect(() => { 
     setCurrentPage(page)
  }, [page])

  // set the current page number and update the URL
  const setCurrentPageNo = (pageNumber) => {
       setCurrentPage(pageNumber)

       // Check if the 'page' parameter exists in the search parameters
       if(searchParams.has('page')){
            searchParams.set('page', pageNumber)  
       } else{
            searchParams.append('page', pageNumber) 
       }

       const path = window.location.pathname + "?" + searchParams.toString() 
       navigate(path); 
  }

  return (
    <>
        <div className="d-flex justify-content-center my-4">
            {filteredProducts > resPerPage && (
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={filteredProducts}
                    onChange={setCurrentPageNo}
                    nextPageText={"Next"}
                    prevPageText={"Prev"}
                    firstPageText={"First"}
                    lastPageText={"Last"}
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="active"
                />
            )}
        </div>     
    </>
  )
}

export default CustomPagination