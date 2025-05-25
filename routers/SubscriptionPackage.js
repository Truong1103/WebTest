const express = require("express");
const subscriptionPackageRouter = express.Router();
const passport = require("passport");
const SubscriptionPackage = require("../models/SubscriptionPackage");

// Route để admin tạo gói đăng ký
subscriptionPackageRouter.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role !== "spadmin" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }

    const { name, description, postLimit, duration, price } = req.body;
    if (!name || !description || !postLimit || !duration || !price) {
      return res.status(400).json({
        success: false,
        message: {
          msgBody: "Vui lòng điền đầy đủ thông tin",
          msgError: true,
        },
      });
    }

    const newPackage = new SubscriptionPackage({
      name,
      description,
      postLimit,
      duration,
      price,
      createdBy: req.user._id,
    });

    newPackage.save((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: {
            msgBody: "Lỗi khi tạo gói đăng ký",
            msgError: true,
          },
          err,
        });
      }
      res.status(200).json({
        success: true,
        message: {
          msgBody: "Tạo gói đăng ký thành công",
          msgError: false,
        },
        package: newPackage,
      });
    });
  }
);

// Route để lấy danh sách gói đăng ký (dành cho admin và nhà tuyển dụng)
subscriptionPackageRouter.get(
  "/list",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    SubscriptionPackage.find({ status: true })
      .populate("createdBy", "username")
      .sort({ createdAt: -1 })
      .exec((err, packages) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi lấy danh sách gói đăng ký",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Lấy danh sách gói đăng ký thành công",
            msgError: false,
          },
          packages,
        });
      });
  }
);

// Route để admin cập nhật gói đăng ký
subscriptionPackageRouter.put(
  "/update/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role !== "spadmin" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }

    const { name, description, postLimit, duration, price, status } = req.body;
    SubscriptionPackage.findByIdAndUpdate(
      req.params.id,
      { name, description, postLimit, duration, price, status },
      { new: true },
      (err, updatedPackage) => {
        if (err || !updatedPackage) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi cập nhật gói đăng ký",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Cập nhật gói đăng ký thành công",
            msgError: false,
          },
          package: updatedPackage,
        });
      }
    );
  }
);

// Route để admin xóa gói đăng ký
subscriptionPackageRouter.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role !== "spadmin" && role !== "admin") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Không có quyền truy cập",
          msgError: true,
        },
      });
    }

    SubscriptionPackage.findByIdAndDelete(
      req.params.id,
      (err, deletedPackage) => {
        if (err || !deletedPackage) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi xóa gói đăng ký",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Xóa gói đăng ký thành công",
            msgError: false,
          },
        });
      }
    );
  }
);

module.exports = subscriptionPackageRouter;
