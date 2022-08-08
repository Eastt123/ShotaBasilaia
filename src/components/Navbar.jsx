import React, { Component } from "react";
import { ProductConsumer } from "../context";
import Currency from "./Currency";
import NavCart from "./NavCart";
import logo from "../assets/imgs/a-logo.png";
import { Link } from "react-router-dom";

class Navbar extends Component {



  render() {
    return (
      <ProductConsumer>
        {(value) => {
            const {categories, setProducts, currencyOpenClose, currencyClose, openNavCart} = value;
          return (
            <React.Fragment>
            <nav className="navbar">
              <div className="categories">
                <ul>
                 {categories.map( (item, index) => {
                     return(
                      <Link to={`/category/${item.name}`} onClick={()=>{setProducts(item.name)}} key={index}>{item.name}</Link>

                        )
                 })}
                </ul>

              </div>

              <div className="navbar-brand">
                <Link to="/" onClick={()=>{setProducts()}}>
                  <img  className="logo" src={logo} alt="logo-img" />
                </Link>

                <div   className="currency-cart flex">
                  <div onClick={

                      currencyOpenClose



                } className="currency">
                    <Currency currencyClose={currencyClose}/>
                  </div>

                  <div className="nav-cart ">
                    <NavCart openNavCart={openNavCart}/>
                  </div>
                </div>
              </div>
            </nav>

            </React.Fragment>
          );
        }}
      </ProductConsumer>
    );
  }
}

export default Navbar;
