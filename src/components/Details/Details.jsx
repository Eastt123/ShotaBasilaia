import React, { Component } from "react";
import { ProductConsumer } from "../../context";
import Attribute from "./Attribute";
import { gql } from "@apollo/client";
import { client} from "../../grapQL";



class Details extends Component {
  state = {
    picutereURL: "",
    inCart: false,
    productDetail: {},
    isLoading: true,
  };

  constructor(props) {
    super(props);

    this.handleDetail = (id) => {
      client
        .query({
          query: gql`
        query{
          product(id:"${id}"){
            id
      name
     inStock
      gallery
      description
      category
      attributes{
        name
        type
        items{
          displayValue
          value
          id
        }

      }
      prices{
        currency{
          label
          symbol
        }
        amount

      }
      brand

          }}
        `,
        })
        .then(({ data }) => {
          const { product } = data;
          this.setState(() => {
            return { productDetail: product, isLoading: false };
          });
        });
    };

    this.selectAttribute = (name, id) => {
      let  product = {...this.state.productDetail};
      let selectedAttribute = product.attributes.map((attribute) => {
        if(attribute.name === name){
          const newAttributes = attribute.items.map((item) => {
            if (item.id === id) {
                  if (item.selected === true) {
                    return { ...item, selected: false };
                  } else {
                    return { ...item, selected: true };
                  }
                } else {
                  return { ...item, selected: false };
                }
          })
          return {...attribute, items:newAttributes}
        }else{
          return attribute
        }
      });

      let newProduct = {...product, attributes:selectedAttribute}

      this.setState(() =>{
        return {productDetail: newProduct}
      })

    };

    this.setPrice = (currency) => {
      const {prices} = this.state.productDetail
      const price = prices.find((item) => {
        if(item.currency.symbol === currency){
          return item.amount
        }
      })
      return price.amount
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    this.handleDetail(id);
  }

  render() {
    return (
      <ProductConsumer>
        {(value) => {
          const {name, brand, inStock, description, gallery, attributes } =
            this.state.productDetail;
          const { currency, addToCart, attributeError } = value;
          if (this.state.isLoading) {
            return <div>Loading...</div>;
          } else {
            return (
              <div className="container">
                <article className="product-details">
                  <div className="img-container">
                    <div className="imgs-container">
                      {gallery.map((item, index) => {
                        return (
                          <img
                            key={index}
                            onClick={(e) => {
                              this.setState(() => {
                                return { picutereURL: item };
                              });
                            }}
                            className="product-img-sm"
                            src={item}
                            alt="no-img"
                          />
                        );
                      })}
                    </div>
                    <img
                      className="product-img-lg"
                      src={
                        this.state.picutereURL
                          ? this.state.picutereURL
                          : gallery[0]
                      }
                      alt="no-img"
                    />
                  </div>
                  <div>
                    <header>
                      <h1>{brand}</h1>
                      <h1>{name}</h1>
                      <p dangerouslySetInnerHTML={{ __html: description }}></p>
                    </header>
                    <div className="size-container">
                      {attributes.map((item, index) => {
                        const { items, name } = item;
                        if (item.type === "swatch") {
                          return (
                            <Attribute
                              key={index}
                              items={items}
                              name={name}
                              swatch={true}
                              selectAttribute={this.selectAttribute.bind(this)}
                            />
                          );
                        } else {
                          return (
                            <Attribute
                              key={index}
                              items={items}
                              name={name}
                              selectAttribute={this.selectAttribute.bind(this)}
                            />
                          );
                        }
                      })}
                    </div>
                    <div className="price-container">
                      {attributeError ? <div className="error-attribute"><h4>Select Attribute(s)</h4></div> : null}
                      <h4>PRICE:</h4>
                      <h4 className="price">{this.setPrice(currency)} {currency}</h4>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(this.state.productDetail)
                      }}
                      disabled={inStock ? false : true}
                      className="add-btn"
                    >
                      <h4>add to cart</h4>
                    </button>
                    <p dangerouslySetInnerHTML={{ __html: description }}></p>
                    <p className="description">
                      Find stunning women's cocktail dresses and party dresses.
                      Stand out in lace and metallic cocktail dresses and party
                      dresses from all your favorite brands.
                    </p>
                  </div>
                </article>
              </div>
            );
          }
        }}
      </ProductConsumer>
    );
  }
}

export default Details;
