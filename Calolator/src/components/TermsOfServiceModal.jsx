import React from "react";

const TermsOfServiceModal = ({ onClose }) => {
  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-100" 
        onClick={handleClickOutside}>
      <div className="bg-white p-6 rounded-xl shadow-xl max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Điều khoản sử dụng</h2>
        <p className="mb-2">
          Khi sử dụng dịch vụ, bạn đồng ý với các điều khoản sau:
        </p>
        <ul className="list-disc list-inside text-sm">
          <li>Không sử dụng vào mục đích vi phạm pháp luật.</li>
          <li>Không phá hoại, gây ảnh hưởng đến hệ thống.</li>
          <li>Tuân thủ quy định từ nhà cung cấp.</li>
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

export default TermsOfServiceModal;
