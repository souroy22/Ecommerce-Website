import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import { getAllProducts, deleteProduct } from "../admin/helper/adminapicall";
import { API } from "../backend";

const ShowCarousel = () => {
  const [products, setProducts] = useState([]);
  const size = 5;
  const preload = () => {
    getAllProducts().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setProducts(data);
      }
    });
  };

  useEffect(() => {
    preload();
  }, []);
  const startingIndex = Math.floor(Math.random() * products.length);
  const endingIndex = startingIndex + size;
  return (
    <Carousel
      pause={false}
      fade={true}
      controls={false}
      style={{
        height: "600px",
        overflow: "hidden",
        width: "100%",
        marginTop: "10px",
      }}
    >
      {products.slice(startingIndex, endingIndex).map((product, index) => {
        return (
          <Carousel.Item key={index} interval={4000} style={{ width: "100%" }}>
            <img
              className="d-block w-100"
              style={{ height: "550px" }}
              src={`${API}/product/photo/${product._id}`}
              alt="First slide"
            />
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

export default ShowCarousel;
