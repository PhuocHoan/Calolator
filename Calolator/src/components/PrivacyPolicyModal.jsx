import React from "react";

const PrivacyPolicyModal = ({ onClose }) => {
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-100"
        onClick={handleClickOutside}>
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Chính sách riêng tư</h2>
        <p className="mb-2">
          Chúng tôi cam kết bảo mật thông tin cá nhân của bạn:
        </p>
        <ul className="list-disc list-inside text-sm">
          <li>Không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý.</li>
          <li>Chỉ thu thập dữ liệu phục vụ cho trải nghiệm người dùng.</li>
          <li>Bạn có thể yêu cầu xem, chỉnh sửa hoặc xoá dữ liệu của mình.</li>
        </ul>
        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
