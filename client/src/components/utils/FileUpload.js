import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import * as api from '../Config';

function FileUpload(props) {
  const [images, setImages] = useState([]);

  const dropHandler = (files) => {
    let formData = new FormData();

    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    axios
      .post(`${api.PRODUCT_SERVER}/image`, formData, config)
      .then((response) => {
        if (response.data.success) {
          setImages([...images, response.data.filePath]);
          props.refreshFunction([...images, response.data.filePath]);
        } else {
          alert('파일 저장 실패');
        }
      });
  };

  const deleteHandler = (image) => {
    const currentIndex = images.indexOf(image);

    let newImages = [...images];
    newImages.splice(currentIndex, 1);

    setImages(newImages);
    props.refreshFunction(newImages);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps()}
              style={{
                width: 300,
                height: 240,
                border: '1px solid lightgray',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <input {...getInputProps()} />
              <PlusOutlined style={{ fontSize: '3rem' }} />
            </div>
          </section>
        )}
      </Dropzone>

      <div
        style={{
          display: 'flex',
          width: '350px',
          height: '240px',
          overflowX: 'scroll',
          overflowY: 'hidden',
        }}
      >
        {images.map((image, index) => (
          <div key={index} onClick={() => deleteHandler(image)}>
            <img
              style={{ minWidth: '300px', width: '300px', height: '240px' }}
              src={`http://localhost:5000/${image}`}
              alt='#'
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
