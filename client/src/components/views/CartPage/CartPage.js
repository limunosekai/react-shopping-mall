import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getCartItems,
  paymentSuccess,
  removeCartItem,
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result } from 'antd';
import Paypal from '../../utils/Paypal';

function CartPage(props) {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    setShowTotal(true);
  };

  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  const transactionSuccess = (data) => {
    dispatch(
      paymentSuccess({
        paymentData: data,
        cartDetail: props.user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
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

      {showTotal ? (
        <div style={{ width: '90%', margin: '3rem auto', textAlign: 'center' }}>
          <h2>
            결제하실 총 금액:<strong> {total} 원</strong>
          </h2>
        </div>
      ) : showSuccess ? (
        <Result status='success' title='덕분에 먹고 삽니다.' />
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
      {showTotal && <Paypal total={total} onSuccess={transactionSuccess} />}
    </div>
  );
}

export default CartPage;
