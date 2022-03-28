import React, { Component } from "react";
import { gql } from "@apollo/client";
import {client} from "./grapQL";
const ProductContext = React.createContext();


class ProductProvider extends Component {
  state = {
    productList: [],
    // productDetail: {},
    cart: [],
    categories: [],
    currencies: [],
    currency: "$",
    navCartProducts: [],
    navCartOpen: false,
    isLoading: true,
    isOverlay: false,
    isCurrency: false,
    isDetail: true,
    count: 0,
    attributes: [],
    total: 0,
    attributeError: false,
  };

  calculateTotal = () => {
    const tempCart = [...this.state.cart];
    let total = 0;
    if (tempCart.length > 0) {
      total = tempCart
        .reduce((prev, next) => {
          // console.log(next, prev);
          return (prev += this.setPrice(next.id) * next.amount);
        }, 0)
        .toFixed(2);
    }

    this.setState(() => {
      return { total: total };
    });
  };

  componentDidMount() {
    this.setProducts();
  }

  getItem = (id) => {
    const { products } = this.state.productList;
    const selectedItem = products.find((item) => {
      return item.id === id;
    });

    return selectedItem;
  };

  increment = (product) => {
    const {cart} = this.state
    let count = this.state.count + 1;
    cart.forEach((item) => {
      if(this.deepEqual(item, product)){
        let newCart = [...cart];
        let index = newCart.indexOf(item);
        let newItem = newCart[index];
        newItem.amount += 1;
        this.setState(()=>{
          return {cart: newCart, count:count}
        },() => this.calculateTotal())
      }

    })

  };

  decrement = (product) => {
    const {cart} = this.state
    let count = this.state.count - 1;
    cart.forEach((item) => {
      if(this.deepEqual(item, product)){
        let newCart = [...cart];
        let index = newCart.indexOf(item);
        let newItem = newCart[index];
        newItem.amount -= 1;
        newCart = newCart.filter((item) => {
          return item.amount !== 0;
        })
        this.setState(()=>{
          return {cart: newCart, count:count}
        }, () => this.calculateTotal())
      }

    })
  };

  setProducts = async (category = "all") => {
    client
      .query({
        query: gql`
      query{
        category(input: { title: "${category}" }) {
          name
          products {
            id
            name
            gallery
            inStock
            brand
            description
            category
            attributes {
              name
              type
              items {
                id
                displayValue
                value
              }
            }
            prices {
              currency {
                label
                symbol
              }
              amount
            }
          }
        }
        categories {
          name
        }

        currencies {
          label
          symbol
        }
      }`,
      })
      .then(({ data }) => {
        const { categories, category, currencies } = data;
        this.setState(() => {
          return {
            productList: category,
            categories: categories,
            currencies: currencies,
            isLoading: false,
          };
        });
      });
  };



  removeItem = async (id) => {
    let tempCart = [...this.state.cart];
    tempCart = tempCart.filter((item) => {
      return item.id !== id;
    });

    this.setState(() => {
      return { cart: [...tempCart] };
    });
  };


  openNavCart = () => {
    this.setState(() => {
      return {
        navCartOpen: !this.state.navCartOpen,
        isOverlay: !this.state.isOverlay,
        isCurrency: false,
      };
    });
  };

  setCurrency = (currency) => {
    this.setState(
      () => {
        return { currency: currency };
      },
      () => {
        this.calculateTotal();
      }
    );
  };


  setPrice = (id) => {
    const product = this.getItem(id);
    const price = product.prices.find((item) => {
      if (item.currency.symbol === this.state.currency) {
        return item.amount;
      } else {
        return null;
      }
    });

    return price.amount.toFixed(2);
  };
  currencyOpenClose = (e) => {
    if (this.state.isOverlay) {
      this.setState(() => {
        return {
          isCurrency: !this.state.isCurrency,
          isOverlay: false,
          navCartOpen: false,
        };
      });
    } else {
      this.setState(() => {
        return { isCurrency: !this.state.isCurrency };
      });
    }
  };

  currencyClose = () => {
    this.setState(() => {
      return { isCurrency: false };
    });
  };


   deepEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = this.isObject(val1) && this.isObject(val2);
      if (
        (areObjects && !this.deepEqual(val1, val2)) ||
        (!areObjects && val1 !== val2)
      ) {
        return false;
      }
    }
    return true;
  }
   isObject = (object) => {
    return object != null && typeof object === "object";
  }


  addToCart = (product) => {
    const { attributes } = product;
    const { cart } = this.state;
    let error = false;
    attributes.map((attribute) => {
      const { items } = attribute;
      for (let index = 0; index < items.length; index++) {
        if (items[index].selected === true) {
          this.setState(() => {
            return { attributeError: false };
          });
          error = false;
          break;
        } else {
          error = true;
          this.setState(() => {
            return { attributeError: true };
          });
        }
      }
    });



    if (!error && this.state.cart.length === 0) {
      this.setState(
        () => {
          return {
            cart: [...this.state.cart, { ...product, amount: 1 }],
            count: this.state.count + 1,
          };
        },
        () => {
          this.calculateTotal();
        }
      );
    } else if (!error && this.state.cart.length > 0) {
      cart.forEach((item) => {
        if (this.deepEqual(item.attributes, product.attributes)) {
          let newCart = [...cart];
          const index = newCart.indexOf(item);
          let product = newCart[index];
          product.amount += 1;
          this.setState(
            () => {
              return { cart: newCart, count: this.state.count + 1 };
            },
            () => {
              this.calculateTotal();
            }
          );
        } else {
          this.setState(
            () => {
              return {
                cart: [...cart, { ...product, amount: 1 }],
                count: this.state.count + 1,
              };
            },
            () => {
              this.calculateTotal();
            }
          );
        }
      });

      // const cartItem = cart.find((item) => {
      //   console.log(3);
      //   return item.id === product.id
      // })
      // if(cartItem && deepEqual(cartItem.attributes, product.attributes)){
      //   console.log(2);
      //   let newCart = [...cart];
      //   const index = newCart.indexOf(cartItem);
      //   let product = newCart[index];
      //   product.amount += 1;
      //   this.setState(()=>{
      //     return {cart: newCart, count:this.state.count + 1}
      //   }, ()=>{this.calculateTotal()})
      // }else{
      //   console.log(123);
      //   this.setState(()=>{
      //     return {cart:[...cart, {...product, amount: 1}], count:this.state.count + 1}
      //   },()=>{this.calculateTotal()})
      // }
    }
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          getItem: this.getItem,
          openNavCart: this.openNavCart,
          removeItem: this.removeItem,
          increment: this.increment,
          decrement: this.decrement,
          addToCart: this.addToCart,
          currencyOpenClose: this.currencyOpenClose,
          currencyClose: this.currencyClose,
          setCurrency: this.setCurrency,
          setPrice: this.setPrice,
          calculateTotal: this.calculateTotal,
          setProducts:this.setProducts
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export { ProductProvider, ProductConsumer };
