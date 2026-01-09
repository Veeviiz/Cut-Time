import React, { useState } from "react";

const DropZone = ({ onFiles, onClick }) => {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onClick={onClick}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        onFiles(Array.from(e.dataTransfer.files));
      }}
      className={`w-full mt-4 p-6 border-2 border-dashed rounded-lg
        cursor-pointer text-center transition
        ${
          dragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 bg-slate-900"
        }`}
    >
      <p className="text-gray-300">ลากไฟล์วิดีโอมาวางที่นี่</p>
      <p className="text-sm text-gray-500">หรือคลิกเพื่อเลือกไฟล์</p>
    </div>
  );
};

export default DropZone;
