const express = require("express");
const purchasedSubscriptionRouter = express.Router();
const passport = require("passport");
const SubscriptionPackage = require("../models/SubscriptionPackage");
const PurchasedSubscription = require("../models/PurchasedSubscription");

// Route để nhà tuyển dụng mua gói đăng ký
purchasedSubscriptionRouter.post(
  "/purchase/:packageId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role } = req.user;
    if (role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Chỉ nhà tuyển dụng mới có thể mua gói đăng ký",
          msgError: true,
        },
      });
    }

    SubscriptionPackage.findById(req.params.packageId, (err, package) => {
      if (err || !package) {
        return res.status(404).json({
          success: false,
          message: {
            msgBody: "Gói đăng ký không tồn tại",
            msgError: true,
          },
          err,
        });
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + package.duration);

      const newPurchasedSubscription = new PurchasedSubscription({
        package: package._id,
        recruiter: req.user._id,
        expiryDate,
        totalAmount: package.price,
        paymentStatus: "pending",
      });

      newPurchasedSubscription.save((err, purchased) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi mua gói đăng ký",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Mua gói đăng ký thành công, vui lòng thanh toán",
            msgError: false,
          },
          purchased,
        });
      });
    });
  }
);

// Route để nhà tuyển dụng hủy gói chưa thanh toán
purchasedSubscriptionRouter.delete(
  "/cancel/:subscriptionId",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role, _id } = req.user;
    if (role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Chỉ nhà tuyển dụng mới có thể hủy gói",
          msgError: true,
        },
      });
    }

    PurchasedSubscription.findOne(
      { _id: req.params.subscriptionId, recruiter: _id },
      (err, subscription) => {
        if (err || !subscription) {
          return res.status(404).json({
            success: false,
            message: {
              msgBody: "Gói đăng ký không tồn tại hoặc không thuộc về bạn",
              msgError: true,
            },
            err,
          });
        }

        if (subscription.paymentStatus !== "pending") {
          return res.status(400).json({
            success: false,
            message: {
              msgBody: "Chỉ có thể hủy gói chưa thanh toán",
              msgError: true,
            },
          });
        }

        PurchasedSubscription.deleteOne(
          { _id: req.params.subscriptionId },
          (err, result) => {
            if (err) {
              return res.status(500).json({
                success: false,
                message: {
                  msgBody: "Lỗi khi hủy gói đăng ký",
                  msgError: true,
                },
                err,
              });
            }
            res.status(200).json({
              success: true,
              message: {
                msgBody: "Hủy gói đăng ký thành công",
                msgError: false,
              },
            });
          }
        );
      }
    );
  }
);

// Route để nhà tuyển dụng xem danh sách gói đã mua
purchasedSubscriptionRouter.get(
  "/my-subscriptions",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { role, _id } = req.user;
    if (role !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: {
          msgBody: "Chỉ nhà tuyển dụng mới có thể xem gói đã mua",
          msgError: true,
        },
      });
    }

    PurchasedSubscription.find({ recruiter: _id })
      .populate("package")
      .sort({ purchaseDate: -1 })
      .exec((err, subscriptions) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi lấy danh sách gói đã mua",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Lấy danh sách gói đã mua thành công",
            msgError: false,
          },
          subscriptions,
        });
      });
  }
);

// Route để admin xem tất cả giao dịch mua gói
purchasedSubscriptionRouter.get(
  "/all",
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

    PurchasedSubscription.find({})
      .populate("package")
      .populate("recruiter", "username")
      .sort({ purchaseDate: -1 })
      .exec((err, subscriptions) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: {
              msgBody: "Lỗi khi lấy danh sách giao dịch",
              msgError: true,
            },
            err,
          });
        }
        res.status(200).json({
          success: true,
          message: {
            msgBody: "Lấy danh sách giao dịch thành công",
            msgError: false,
          },
          subscriptions,
        });
      });
  }
);

module.exports = purchasedSubscriptionRouter;
