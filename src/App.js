import './App.css';
import {Switch,Route } from "react-router-dom";
import React, {Component} from "react";
import Navbar from './components/Navbar';
import Details from "./components/Details/Details";
import Cart from "./components/Cart";
import ProductList from "./components/ProductList";
import Overlay from "./components/Overlay";
import { ProductConsumer } from './context';

class App extends Component{
  render(){
   return(
     <ProductConsumer>
       {value => {
         const {handleDetail, setProducts} = value;
         return(
    <React.Fragment>
      <Navbar />
      <Switch>
      <Route exact path="/" component={ProductList} />
      <Route exact path="/category/:category" render={(props) => <ProductList setProducts={setProducts} {...props} />} />
      <Route path="/details/:id" render={(props) => <Details handleDetail={handleDetail} {...props} />} />
      <Route path="/cart" component={Cart} />
      </Switch>
      <Overlay />
    </React.Fragment>)}}
    </ProductConsumer>
   )
  }
}

export default App;