const express = require("express");
const router = express.Router();
const PayOS = require("@payos/node");
const PurchasedSubscription = require("../models/PurchasedSubscription");

// Cấu hình PayOS
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

// API tạo link thanh toán
router.post("/create-payment-link", async (req, res) => {
  const { subscriptionId } = req.body;

  try {
    // Tìm gói đã mua trong cơ sở dữ liệu
    const subscription = await PurchasedSubscription.findById(subscriptionId)
      .populate("package")
      .populate("recruiter");

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: {
          msgBody: "Gói đăng ký không tồn tại",
          msgError: true,
        },
      });
    }

    if (subscription.paymentStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: {
          msgBody: "Gói này đã được thanh toán hoặc bị hủy",
          msgError: true,
        },
      });
    }

    const YOUR_DOMAIN = "http://localhost:3000";
    const order = {
      amount: subscription.totalAmount,
      description: `Thanh toán gói ${subscription.package.name}`,
      orderCode: parseInt(Date.now() + Math.random() * 1000), // Mã đơn hàng duy nhất
      returnUrl: `${YOUR_DOMAIN}/payment/success`,
      cancelUrl: `${YOUR_DOMAIN}/payment/cancel`,
    };

    // Gọi PayOS để tạo link thanh toán
    const paymentLink = await payos.createPaymentLink(order);

    // Lưu orderCode vào PurchasedSubscription để đối chiếu sau này
    subscription.orderCode = order.orderCode;
    await subscription.save();

    res.status(200).json({
      success: true,
      message: {
        msgBody: "Tạo link thanh toán thành công",
        msgError: false,
      },
      checkoutUrl: paymentLink.checkoutUrl,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: {
        msgBody: "Lỗi khi tạo link thanh toán",
        msgError: true,
      },
      error: error.message,
    });
  }
});

router.post("/webhook", async (req, res) => {
  console.log("Webhook received at:", new Date(), "Data:", req.body);
  try {
    const webhookData = req.body;
    const isValid = payos.verifyPaymentWebhookData(webhookData);
    if (!isValid) {
      console.log("Invalid webhook data at:", new Date());
      return res.status(400).json({ message: "Invalid webhook data" });
    }

    const { data } = webhookData; // PayOS thường bọc data trong object
    const { orderCode, status } = data;
    console.log("Processing orderCode:", orderCode, "with status:", status);

    const subscription = await PurchasedSubscription.findOne({ orderCode });
    if (!subscription) {
      console.log("Subscription not found for orderCode:", orderCode);
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (status === "PAID") {
      subscription.paymentStatus = "completed";
      subscription.status = true;
      console.log("Updated to completed for orderCode:", orderCode);
    } else if (status === "CANCELLED") {
      subscription.paymentStatus = "failed";
      subscription.status = false;
      console.log("Updated to failed for orderCode:", orderCode);
    }

    await subscription.save();
    console.log("Subscription saved successfully at:", new Date());
    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error at:", new Date(), error.message);
    res.status(500).json({
      message: "Error processing webhook",
      error: error.message,
    });
  }
});

router.post("/update-payment-status", async (req, res) => {
  try {
    const { orderCode, status } = req.body;
    const subscription = await PurchasedSubscription.findOne({ orderCode });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (status === "completed") {
      subscription.paymentStatus = "completed";
      subscription.status = true;
    }
    await subscription.save();
    res.status(200).json({ message: "Payment status updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
});

module.exports = router;
