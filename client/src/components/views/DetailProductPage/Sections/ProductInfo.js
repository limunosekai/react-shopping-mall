import React from 'react';
import { Descriptions, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../../_actions/user_actions';

function ProductInfo(props) {
  const dispatch = useDispatch();
  console.log(props);
  const clickHandler = () => {
    // 상품 정보를 DB Cart 필드에 추가
    dispatch(addToCart(props.detail._id));
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Descriptions title='상품 정보' bordered>
        <Descriptions.Item label='가격' contentStyle={{ fontSize: '1.25rem' }}>
          {props.detail.price} 원
        </Descriptions.Item>
        <Descriptions.Item
          label='판매량'
          contentStyle={{ fontSize: '1.25rem' }}
        >
          {props.detail.sold}
        </Descriptions.Item>
        <Descriptions.Item
          label='조회수'
          contentStyle={{ fontSize: '1.25rem' }}
        >
          {props.detail.views}
        </Descriptions.Item>
        <Descriptions.Item label='설명'>
          {props.detail.description}
        </Descriptions.Item>
      </Descriptions>
      <br />
      <br />
      <br />
      {props.userInfo.userData && props.userInfo.userData.isAuth ? (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            size='large'
            shape='round'
            type='primary'
            onClick={clickHandler}
          >
            Add to Cart
          </Button>
        </div>
      ) : (
        <span>로그인 후 구매가 가능합니다</span>
      )}
    </div>
  );
}

export default ProductInfo;
