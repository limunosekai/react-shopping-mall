import React, { useState } from 'react';
import { Typography, Button, Form, Input } from 'antd';

import FileUpload from '../../utils/FileUpload';

const { Title } = Typography;
const { TextArea } = Input;

const continentOptions = [
  { key: 1, value: '서울' },
  { key: 2, value: '경기' },
  { key: 3, value: '강원' },
  { key: 4, value: '전라' },
  { key: 5, value: '경상' },
  { key: 6, value: '제주' },
  { key: 7, value: '충청' },
];

function UploadProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [continent, setContinent] = useState(1);
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

  const continentChangeHandler = (e) => {
    setContinent(e.currentTarget.value);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Title level={2}>상품 업로드</Title>
      </div>
      <Form>
        {/* Drop Zone */}
        <FileUpload />
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
        <select onChange={continentChangeHandler} value={continent}>
          {continentOptions.map((option) => {
            return (
              <option key={option.key} value={option.key}>
                {option.value}
              </option>
            );
          })}
        </select>
        <br />
        <br />
        <Button>확인</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
