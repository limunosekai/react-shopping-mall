import React from 'react';
import './UserCardBlock.css';
import { Button } from 'antd';

function UserCardBlock(props) {
  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `http://localhost:5000/${image}`;
    }
  };

  const renderItems = () =>
    props.products &&
    props.products.map((product) => (
      <tr key={product._id}>
        <td>
          <img
            style={{ width: '150px' }}
            alt='#'
            src={renderCartImage(product.images)}
          />
        </td>
        <td>{product.quantity} 개</td>
        <td>{product.price} 원</td>
        <td>
          <Button type='default' danger>
            삭제
          </Button>
        </td>
      </tr>
    ));

  return (
    <div>
      <table>
        <colgroup>
          <col width='25%' />
          <col width='25%' />
          <col width='25%' />
          <col width='25%' />
        </colgroup>
        <thead>
          <tr>
            <th>상품 이미지</th>
            <th>상품 수량</th>
            <th>상품 가격</th>
            <th>상품 삭제</th>
          </tr>
        </thead>
        <tbody>{renderItems()}</tbody>
      </table>
    </div>
  );
}

export default UserCardBlock;
