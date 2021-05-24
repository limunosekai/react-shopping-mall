import React, { useState } from 'react';
import { Typography, Button, Form, Input } from 'antd';

import FileUpload from '../../utils/FileUpload';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const categoriesOptions = [
  { key: 1, value: '액션' },
  { key: 2, value: '아케이드' },
  { key: 3, value: '어드벤처' },
  { key: 4, value: 'RPG' },
  { key: 5, value: '레이싱' },
  { key: 6, value: '시뮬레이션' },
  { key: 7, value: '스포츠' },
];

function UploadProductPage(props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [categories, setCategories] = useState(1);
  const [images, setImages] = useState([]);

  const titleChangeHandler = (e) => {
    setTitle(e.currentTarget.value);
  };

  const descriptionChangeHandler = (e) => {
    setDescription(e.currentTarget.value);
  };

  const priceChangeHandler = (e) => {
    setPrice(e.currentTarget.value);
  };

  const categoriesChangeHandler = (e) => {
    setCategories(e.currentTarget.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const submitHandler = () => {
    if (!title || !description || !price || !categories || !images) {
      return alert('모든 칸을 입력해주세요');
    }

    // 서버에 form을 전달
    const body = {
      // 현재 로그인중인 사용자의 id
      writer: props.user.userData._id,
      title,
      description,
      price,
      images,
      categories,
    };

    axios.post('/api/product', body).then((response) => {
      if (response.data.success) {
        alert('상품 업로드 성공');
        props.history.push('/');
      } else {
        alert('상품 업로드 실패');
      }
    });
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>상품 업로드</Title>
      </div>
      <Form onFinish={submitHandler}>
        {/* Drop Zone */}
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input value={title} onChange={titleChangeHandler} />
        <br />
        <br />
        <label>설명</label>
        <TextArea value={description} onChange={descriptionChangeHandler} />
        <br />
        <br />
        <label>가격</label>
        <Input type='number' value={price} onChange={priceChangeHandler} />
        <br />
        <br />
        <select onChange={categoriesChangeHandler} value={categories}>
          {categoriesOptions.map((option) => {
            return (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <Button htmlType='submit'>확인</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
