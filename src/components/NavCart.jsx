import React, { Component } from "react";
import { ProductConsumer } from "../context";
import cartIcon from "../assets/imgs/EmptyCart.svg";
import CartItem from "./CartItem";
import {Link} from "react-router-dom";
class NavCart extends Component {
  constructor(props){
    super(props);
    this.ulRef = React.createRef();
    this.cartRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {

    if (this.cartRef && !this.cartRef.current.contains(event.target)) {
      const { openNavCart } = this.props;
      openNavCart()
    }
  }


  componentDidUpdate(){
    if(this.ulRef.current){
      // const {height} = this.ulRef.current.getBoundingClientRect()
      // this.cartRef.current.style.height = height + 150 + "px";
      document.addEventListener("click", this.handleClickOutside);
    }else{
      document.removeEventListener("click", this.handleClickOutside);
      // this.cartRef.current.style.height = 0 + "px";
    }
  }

  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const { count, openNavCart, navCartOpen, cart, total, currency} = value;
          return (
            <React.Fragment>
              <div className="cart-containcer">
                <div onClick={(e) =>{e.stopPropagation();openNavCart();}} className='circle'>{count}</div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    openNavCart();
                  }}
                  className="cart-container "
                >
                  <img className="img-logo " src={cartIcon} alt="cart-img" />
                </div>
              </div>

                <div ref={this.cartRef} className={`cart ${navCartOpen ? "navOpen" : "navClose"}`}  >

              {navCartOpen && (
                  <div className="cart-content">
                  <div className="list">
                    <div className="cart-title">
                      <h4>My bag,</h4>
                      <p>{count} items</p>
                    </div>

                    <ul ref={this.ulRef} >
                      {cart.map((item,index) => {
                        return <CartItem key={index} item={item}/>
                      })}

                    </ul>

                  </div>

                  <div>
                  <div className="total-container">
                      <h5>Total:</h5>
                      <h5>{total} {currency}</h5>
                    </div>
                    <div className="cart-links">
                <Link className="nav-cart-link" to="/cart">view cart</Link>
                <Link className="nav-cart-link" to="#">check out</Link>
                </div>
                </div>
                </div>

              )}
              </div>


            </React.Fragment>
          );
        }}
      </ProductConsumer>
    );
  }
}

export default NavCart;
