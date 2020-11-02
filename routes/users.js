const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ObjectId = require("mongodb").ObjectID; // esto esta por estudiar si se queda o se va

router.post("/authenticate", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({ success: false, msg: "User not found" });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
          expiresIn: 604800, //1 week
        });

        res.json({
          success: true,
          token: "bearer " + token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        return res.json({ success: false, msg: "Wrong password" });
      }
    });
  });
});

router.post("/register", (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({ success: false, msg: "Failed to register user" });
    } else {
      res.json({ success: true, msg: "User registered" });
    }
  });
});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({ user: req.user });
  }
);

router.post("/shipping-address", (req, res, next) => {
  let data = {
    userID: req.body.userID,
    isDefault: req.body.default,
  };
  User.clearDefaultAddress(data, (err) => {
    if (err) {
      res.json({
        success: false,
        msg: "The default address could not be cleared",
      });
    } else {
      // Pushing the new address
      User.addShippingAddress(req.body, (err) => {
        if (err) {
          res.json({
            success: false,
            msg: "The new shipping address could not be added",
          });
        }
        return res.json({ success: true });
      });
    }
  });
});

router.get("/shipping-address/:userID", async (req, res, next) => {
  try {
    let address = await User.aggregate([
      { $match: { _id: ObjectId(req.params.userID) } },
      { $project: { shippingAddress: 1 } },
    ]);
    // console.log(address[0])

    if (!address || address[0].shippingAddress.length == 0) {
      return res.json({ isEmpty: true });
    }

    let arrayAddress = address[0].shippingAddress;
    return res.json({ isEmpty: false, arrayAddress });
  } catch (err) {
    console.log(err);
    next();
  }
});

router.delete(
  "/shipping-address/:idUser/:idShippingAddress",
  async (req, res, next) => {
    User.delShippingAddress(req.params, (err) => {
      if (err) {
        return res.json({
          success: false,
          msg: "The shipping address could not be deleted",
        });
      }
      return res.json({ success: true });
    });
  }
);

module.exports = router;
