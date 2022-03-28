import React, { Component } from "react";
import { Link } from "react-router-dom";
import Product from "./Product";
import { ProductConsumer } from "../context";

class ProductList extends Component {

  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const products = value.productList;
          const { isLoading} = value;
          if (isLoading) {
            return <div className="Loading">Loading...</div>;
          } else {
            return (
              <div className="container">
              <section className="product-list">
                <h1 className="title">{products.name}</h1>
                <div className="products">
                  {
                    products.products.map((product, index) => {

                      return <Link key={index} onClick={(e) => {e.stopPropagation(); }} className='link' to={`/details/${product.id}`} id={product.id}> <Product {...product} /></Link>

                    })}

                </div>
              </section>
              </div>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

export default ProductList;