import React, { Component } from "react";
import { ProductConsumer } from "../context";
import vectrorUp from "../assets/imgs/Vector-up.png";
import vectror from "../assets/imgs/Vector.png";

class Currency extends Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
    this.listContainer = React.createRef();
    this.currency = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {

    if (this.currency && !this.currency.current.contains(event.target)) {

      const { currencyClose } = this.props;
      currencyClose();
    }
  }



  componentDidUpdate() {
    if (this.listRef.current) {
      const { height } = this.listRef.current.getBoundingClientRect();
      this.listContainer.current.style.height = height + "px";
      document.addEventListener("click", this.handleClickOutside);
    } else {
      this.listContainer.current.style.height = 0 + "px";
      document.removeEventListener("click", this.handleClickOutside);
    }
  }



  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const { isCurrency, setCurrency, currencies, currency,currencyOpenClose} = value;
          return (
            <React.Fragment>
              <div ref={this.currency} className="currency-container flex">
                <h5 className="currency-sign">{currency}</h5>
                <div className="icon-container flex">
                  {value.isCurrency ? (
                    <img src={vectrorUp} className="vector" alt="img-vector" />
                  ) : (
                    <img src={vectror} className="vector" alt="img-vector" />
                  )}
                </div>
              </div>
              <div
                ref={this.listContainer}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="curs"
              >
                {isCurrency && (
                  <ul  ref={this.listRef}>
                    {currencies.map((item, index) => {
                      const {label, symbol} = item;
                      return (

                        <li onClick={(e) =>{e.stopPropagation();}} className="flex" key={index}>
                          <button className="currency-btn"
                          value={symbol}
                          onClick={(e) => {
                          e.stopPropagation();
                          setCurrency(e.target.value);
                          currencyOpenClose();
                        }
                        }

                          key={index}>
                          {label}
                          {symbol}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </React.Fragment>
          );
        }}
      </ProductConsumer>
    );
  }
}

export default Currency;
