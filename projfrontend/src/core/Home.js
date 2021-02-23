import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import "../styles.css";
import { API } from "../backend";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";
import ShowCarousel from "./Carousel";
import { loadCart, setCart } from "./helper/cartHelper";
import "./home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [cartProducts, setCartProducts] = useState([]);
  const [reloadCartItems, setReloadCartItems] = useState(false);
  const displayProdPerPage = 6;
  const totalVisistedProd = pageNumber * displayProdPerPage;

  const totalPages = Math.ceil(products.length / displayProdPerPage);

  const loadAllProduct = () => {
    getProducts().then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    setCart();
    loadAllProduct();
    setCartProducts(loadCart());
  }, [reloadCartItems]);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayProd = () =>
    products
      .filter((val) => {
        if (searchInput == "") {
          return val;
        } else if (val.name.toLowerCase().includes(searchInput.toLowerCase())) {
          return val;
        }
      })
      .slice(totalVisistedProd, totalVisistedProd + displayProdPerPage)
      .map((product, index) => {
        return (
          <div key={index} className="mb-4 mr-2">
            <Card
              product={product}
              reloadCartItems={reloadCartItems}
              setReloadCartItems={setReloadCartItems}
            />
          </div>
        );
      });

  return (
    <Base cartProdCount={cartProducts.length} >
      <input
        type="text"
        className="form-control"
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        placeholder="Search for products..."
        id="inputBar"
      />
      <ShowCarousel />
      <div className="text-center" style={{ marginTop: "10px" }}>
        <div id="product-container" style={{ width: "100%" }}>
          {displayProd()}
        </div>
      </div>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={totalPages}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </Base>
  );
};

export default Home;
