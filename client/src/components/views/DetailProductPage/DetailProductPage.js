import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col } from 'antd';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

function DetailProductPage(props) {
  const productId = props.match.params.productId;

  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`/api/product/product_by_id?id=${productId}&type=single`)
      .then((response) => {
        if (response.data.success) {
          setProduct(response.data.product[0]);
        } else {
          alert('상세 정보 로딩 실패');
        }
      });
  }, []);

  return (
    <div style={{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{product.title}</h1>
      </div>
      <br />
      <Row gutter={[16, 16]}>
        <Col lg={12} sm={24}>
          {/* Product Image */}
          <ProductImage detail={product} />
        </Col>
        <Col lg={12} sm={24}>
          {/* Product Info */}
          <ProductInfo userInfo={props.user} detail={product} />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
