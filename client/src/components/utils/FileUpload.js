import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { PlusOutlined } from '@ant-design/icons';
import * as api from '../Config';

function FileUpload() {
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
        } else {
          alert('파일 저장 실패');
        }
      });
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
    </div>
  );
}

export default FileUpload;
