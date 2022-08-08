import React, { Component } from 'react';
import cart from "../assets/imgs/EmptyCart.svg";
import {ProductConsumer} from "../context";
class Product extends Component {



    render() {
        const {id, name, gallery, inStock } = this.props;
        return (
                <ProductConsumer>
                    {value => {

const {setPrice, currency} = value;
                return( <article className='product'>
                    <img src={gallery[0]} className='product-img-list' alt="product-img" />
                    <div className='title'>
                    <p>{name}</p>
                    <h4>{setPrice(id)} {currency}</h4>
                    </div>

                    <button disabled={inStock ? false : true}  className="stock-circle">
                        {inStock ? <img src={cart} alt="stock-img" /> : <h4 style={{color:"black"}}> Out Of Stock</h4>}

                        </button>
                </article>)

                    }}

                </ProductConsumer>

        );
    }
}

export default Product;