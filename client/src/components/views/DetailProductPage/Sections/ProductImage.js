import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {
  const [imageDatas, setImageDatas] = useState([]);

  useEffect(() => {
    if (props.detail.images && props.detail.images.length > 0) {
      let images = [];

      props.detail.images.map((image) =>
        images.push({
          original: `http://localhost:5000/${image}`,
          thumbnail: `http://localhost:5000/${image}`,
        })
      );

      setImageDatas(images);
    }
  }, [props.detail]);

  return (
    <div>
      <ImageGallery items={imageDatas} />
    </div>
  );
}

export default ProductImage;
