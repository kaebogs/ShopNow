import React from 'react'
import { useState } from 'react';
import { useNavigate} from 'react-router-dom';

const Search = ({className=""}) => {

    const [keyword, setKeyword] = useState("");

    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        if(keyword?.trim()){
            navigate(`/?keyword=${keyword}`)
        }else{
            navigate(`/`)
        }
    }

  return (
    <>
         <form  className={`${className}`} role="search" onSubmit={submitHandler}>
            <button className="btn btn-dark rounded-1" type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <input
              className="form-control ms-2 w-100"
              type="search"
              placeholder="Enter product name..."
              aria-label="Search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </form>
    </>
  )
}

export default Search