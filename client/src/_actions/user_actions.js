import axios from 'axios';
import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART,
  GET_CART_ITEMS,
  REMOVE_CART_ITEM,
  PAYMENT_SUCCESS,
} from './types';
import { USER_SERVER, PRODUCT_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/register`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: REGISTER_USER,
    payload: request,
  };
}

export function loginUser(dataToSubmit) {
  const request = axios
    .post(`${USER_SERVER}/login`, dataToSubmit)
    .then((response) => response.data);

  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${USER_SERVER}/auth`)
    .then((response) => response.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logoutUser() {
  const request = axios
    .get(`${USER_SERVER}/logout`)
    .then((response) => response.data);

  return {
    type: LOGOUT_USER,
    payload: request,
  };
}

export function addToCart(productId) {
  let body = {
    productId,
  };

  const request = axios
    .post(`${USER_SERVER}/addToCart`, body)
    .then((response) => response.data);

  return {
    type: ADD_TO_CART,
    payload: request,
  };
}

export function getCartItems(cartItems, userCart) {
  const request = axios
    .post(`${PRODUCT_SERVER}/product_by_id?id=${cartItems}&type=array`)
    .then((response) => {
      // 각 상품 정보를 Product Collection에서 가져온 후
      // 각각 quantity를 넣어준다
      userCart.forEach((cartItem) => {
        response.data.product.forEach((productDetail, i) => {
          if (cartItem.id === productDetail._id) {
            response.data.product[i].quantity = cartItem.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: GET_CART_ITEMS,
    payload: request,
  };
}

export function removeCartItem(productId) {
  const request = axios
    .get(`${USER_SERVER}/removeFromCart?id=${productId}`)
    .then((response) => {
      // productInfo, cart 정보를 조합해서 cartDetail 생성
      response.data.cart.forEach((item) => {
        response.data.productInfo.forEach((product, i) => {
          if (item.id === product._id) {
            response.data.productInfo[i].quantity = item.quantity;
          }
        });
      });
      return response.data;
    });

  return {
    type: REMOVE_CART_ITEM,
    payload: request,
  };
}

export function paymentSuccess(data) {
  const request = axios
    .post(`${USER_SERVER}/paymentSuccess`, data)
    .then((response) => response.data);

  return {
    type: PAYMENT_SUCCESS,
    payload: request,
  };
}
