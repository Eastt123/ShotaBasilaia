import React, { Component } from "react";
import { ProductConsumer } from "../../context";

class Attribute extends Component {
  render() {
    const { items, name, selectAttribute,swatch } = this.props;
    return (
      <ProductConsumer>
        {(value) => {
        return (
             <React.Fragment>
            <h4>{name} : </h4>
            <div className="attributes-container">
            {items.map((item, index) => {
              return (
                <button key={index}  onClick={() => {selectAttribute(name, item.id); }} className="btn" style={{
                  backgroundColor: item.value, color:item.displayValue === "Black" ? "#ffff" : null,
                  border: item.selected ? "2px solid orange" : null
                  }}>
                  {swatch ? item.displayValue : item.value}
                </button>
              );
            })}
            </div>
         </React.Fragment>
        )}}
      </ProductConsumer>
    );
  }
}

export default Attribute;
