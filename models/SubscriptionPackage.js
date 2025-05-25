const mongoose = require("mongoose");

const SubscriptionPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    postLimit: {
      type: Number,
      required: true,
      min: 1, // Số bài tuyển dụng tối đa được đăng trong gói
    },
    duration: {
      type: Number,
      required: true,
      min: 1, // Thời gian hiệu lực của gói (tính bằng ngày, ví dụ 7 ngày = 1 tuần)
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Giá của gói (để tích hợp thanh toán sau này)
    },
    currency: {
      type: String,
      default: "VND", // Đơn vị tiền tệ (có thể thay đổi nếu cần)
    },
    status: {
      type: Boolean,
      default: true, // Trạng thái gói (true: hoạt động, false: không hoạt động)
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account", // Liên kết với admin tạo gói
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "SubscriptionPackage",
  SubscriptionPackageSchema
);
