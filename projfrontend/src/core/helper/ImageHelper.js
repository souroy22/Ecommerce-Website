import React from "react";
import { API } from "../../backend";

const ImageHelper = ({ product }) => {
  const imageurl = product
    ? `${API}/product/photo/${product._id}`
    : `https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;
  return (
    <div
      className="rounded border border-success p-2 mb-2"
      style={{
        height: "300px",
        width: "100%",
        overflow: "hidden",
        backgroundSize: "contain",
      }}
    >
      <img
        src={imageurl}
        alt="photo"
        className="mb-3 rounded"
        style={{ maxHeight: "100%", maxWidth: "100%" }}
      />
    </div>
  );
};

export default ImageHelper;
