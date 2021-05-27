const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single('file');

router.post('/image', (req, res) => {
  // 클라가 보낸 이미지를 저장
  upload(req, res, (err) => {
    if (err) return req.json({ success: false, err });
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/', (req, res) => {
  // 클라가 보낸 submit data를 저장
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post('/products', (req, res) => {
  // products collection의 상품 정보 load

  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};
  for (let key in req.body.filter) {
    if (req.body.filter[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          // 크거나 같은 (Greater Than Equal)
          $gte: req.body.filter[key][0],
          // 작거나 같은 (Less Than Equal)
          $lte: req.body.filter[key][1],
        };
      } else {
        findArgs[key] = req.body.filter[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });
        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
});

router.get('/product_by_id', (req, res) => {
  // productId로 상품정보 조회 후 클라에 전송 (상세페이지)
  let type = req.query.type;
  let productId = req.query.id;

  Product.find({ _id: productId })
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      product[0].views++;
      product[0].save();
      return res.status(200).send({ success: true, product });
    });
});

router.post('/product_by_id', (req, res) => {
  // productId로 상품정보 조회 후 클라에 전송 (장바구니)
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === 'array') {
    let ids = req.query.id.split(',');
    productIds = ids.map((item) => {
      return item;
    });
  }

  Product.find({ _id: { $in: productIds } })
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, product });
    });
});

module.exports = router;
