import React, { Component } from "react";
import { ProductConsumer } from "../context";
class Overlay extends Component {
  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const { isOverlay } = value;
          if (isOverlay) {
           return <div className="overlay"></div>;
          } else {
            return null;
          }
        }}
      </ProductConsumer>
    );
  }
}

export default Overlay;
