const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const { auth } = require('../middleware/auth');
const async = require('async');

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post('/addToCart', auth, (req, res) => {
  // User Collection의 모든 정보 조회
  let duplicate = false;
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 이미 해당 상품이 존재하는지 분기
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    // 상품이 있을 때
    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': req.body.productId },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true }, // 업데이트 된 정보를 받기 위한 옵션
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).send(userInfo.cart);
        }
      );
    } else {
      // 상품이 없을 때
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          return res.status(200).send(userInfo.cart);
        }
      );
    }
  });
});

router.get('/removeFromCart', auth, (req, res) => {
  // cart 안의 상품 삭제
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        cart: { id: req.query.id },
      },
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.status(400).send(err);
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });

      // product collection 안의 상품 정보 가져오기
      Product.find({ _id: { $in: array } })
        .populate('writer')
        .exec((err, productInfo) => {
          if (err) return res.status(400).send(err);
          return res.status(200).json({
            productInfo,
            cart,
          });
        });
    }
  );
});

router.post('/paymentSuccess', auth, (req, res) => {
  let history = [];
  let transactionData = {};
  // history 간단한 결제 정보 생성
  req.body.cartDetail.product.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId,
    });
  });
  // 자세한 결제 정보 생성
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  transactionData.data = req.body.paymentData;
  transactionData.product = history;

  // user collection의 history 필드에 데이터 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, userInfo) => {
      if (err) return res.json({ success: false, err });

      // payment collection에 결제 정보 저장
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        // product collection 안의 sold 필드 업데이트

        // 상품별 개수
        let products = [];
        doc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err });
            return res
              .status(200)
              .json({ success: true, cart: userInfo.cart, cartDetail: [] });
          }
        );
      });
    }
  );
});

module.exports = router;
