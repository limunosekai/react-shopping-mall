import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Card, Row, Button } from 'antd';
import { categories, price } from './Sections/Datas';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';

const { Meta } = Card;

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(8);
  const [postSize, setPostSize] = useState(0);
  const [filters, setFilters] = useState({
    categories: [],
    price: [],
  });
  const [searchTerm, setSearchTerm] = useState('');

  const getProducts = (body) => {
    axios.post('/api/product/products', body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productInfo]);
        } else {
          setProducts(response.data.productInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert('상품 데이터 로딩 실패');
      }
    });
  };

  useEffect(() => {
    let body = {
      skip,
      limit,
    };
    getProducts(body);
  }, []);

  const loadMoreHandler = () => {
    let skipCount = skip + limit;
    let body = {
      skip: skipCount,
      limit,
      loadMore: true,
    };
    getProducts(body);
    setSkip(skipCount);
  };

  const renderCards = products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`${product.price} 원`} />
        </Card>
      </Col>
    );
  });

  const showFilterResults = (filter) => {
    let body = {
      skip: 0,
      limit,
      filter,
    };
    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
      }
    }
    return array;
  };

  const handleFilters = (filter, separator) => {
    const newFilters = { ...filters };
    newFilters[separator] = filter;

    if (separator === 'price') {
      let priceValues = handlePrice(filter);
      newFilters[separator] = priceValues;
    }

    showFilterResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit,
      filter: filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>즐거운 쇼핑~😀</h2>
      </div>
      {/* Filter */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <CheckBox
            list={categories}
            handleFilters={(filter) => handleFilters(filter, 'categories')}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filter) => handleFilters(filter, 'price')}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '1rem auto',
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

      {/* Cards */}
      <br />
      <Row gutter={[16, 16]}>{renderCards}</Row>
      {postSize >= limit && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '30px',
          }}
        >
          <Button onClick={loadMoreHandler}>더보기</Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
