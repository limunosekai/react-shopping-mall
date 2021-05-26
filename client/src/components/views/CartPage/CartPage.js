import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cartItems = [];

    // 리덕스 user state의 cart에 상품이 있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });
        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload.product);
          }
        );
      }
    }
  }, [props.user.userData]);

  let calculateTotal = (cartDetail) => {
    let amount = 0;
    cartDetail.map(
      (item) => (amount += parseInt(item.price, 10) * item.quantity)
    );
    setTotal(amount);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      // productInfo, cart 정보를 조합해서 cartDetail 생성
      response.payload.cart.forEach((item) => {
        response.payload.productInfo.forEach((product, i) => {
          if (item.id === product._id) {
            response.payload.productInfo[i].quantity = item.quantity;
          }
        });
      });

      return response.payload;
    });
  };

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <h1>My Cart</h1>
      <div>
        <UserCardBlock
          removeItem={removeFromCart}
          products={props.user.cartDetail && props.user.cartDetail.product}
        />
      </div>
      <div style={{ width: '90%', margin: '3rem auto', textAlign: 'center' }}>
        <h2>
          결제하실 총 금액:<strong> {total} 원</strong>
        </h2>
      </div>
    </div>
  );
}

export default CartPage;
