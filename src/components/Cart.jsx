import React, { Component } from 'react';
import {ProductConsumer} from "../context";
import CartItem from './CartItem';

class Cart extends Component {
    render() {
    return(
        <ProductConsumer>
            {value => {
                const {cart} = value;
                return(
                    <div className='container'>
                    <section className='product-list'>
                        <h1>Cart</h1>
                        <div className='cart-list'>
                        {cart.map((item, index) => {
                            return(
                                <CartItem key={index} item={item}/>
                            )
                        })}
                        </div>
                    </section>
                    </div>
                )
            }}
        </ProductConsumer>
    )
    }
}

export default Cart;