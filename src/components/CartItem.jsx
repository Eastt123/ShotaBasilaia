import React, { Component } from 'react';
import { ProductConsumer } from "../context";
import Attribute from "./Details/Attribute";

class CartItem extends Component {
    render() {
        const {item:{name,gallery, attributes, amount, id }, item} = this.props;
        return (
            <ProductConsumer>
                {value => {
                    const {setPrice, currency, increment, decrement} = value;
                    return(
            <div className='cart-item'>

                    <div className='title-size-container'>
                       <p>{name}</p>
                       <h4>{setPrice(id)} {currency}</h4>
                    <div className='size-container'>
                  {attributes.map((item,index) => {
                 const {items,name} = item;

                  if(item.type === "swatch"){

                    return (
                      <Attribute key={index} swatch={true} items={items} name={name}/>

                    )
                  }else{
                    return(
                      <Attribute key={index} items={items}  name={name}/>

                    )


                  }
               })}

                    </div>
                    </div>
                    <div className='count-img-container'>
                        <div className='count-container'>
                            <button onClick={(e)=>{e.preventDefault(); e.stopPropagation();  increment(item)}} className='btn'>+</button>
                            <p>{amount}</p>
                            <button onClick={(e)=>{e.preventDefault(); e.stopPropagation(); decrement(item)}} className='btn'>-</button>
                        </div>

                        <div className='cart-img-container'>
                            <img src={gallery[0]} alt="product-img" />
                        </div>
                    </div>

            </div>)}}

            </ProductConsumer>

        );
    }
}

export default CartItem;