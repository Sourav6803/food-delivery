import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from "./page/Home";
import Menu from "./page/Menu";
import About from "./page/About";
import Contact from "./page/Contact";
import Login from './page/Login';



import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Newproduct from './page/Newproduct';
import Singup from './page/Singup';
import {store } from "../src/redux/index";
import { Provider } from 'react-redux';
import Cart from './page/Cart';



const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route index element={<Home/>} />
    {/* <Route path="menu" element={<Menu/>} /> */}
    <Route path="menu/:filterby" element={<Menu/>} />
    <Route path="about" element={<About/>} />
    <Route path="contact" element={<Contact/>} />
    <Route path="login" element={<Login/>} />
    <Route path="newproduct" element={<Newproduct/>} />
    <Route path="singup" element={<Singup/>} />
    <Route path="cart" element={<Cart/>} />
  </Route>
))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 <Provider store={store}>
   <RouterProvider router={router} />
 </Provider> 
);


