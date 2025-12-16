import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { UploadCloud } from 'lucide-react';
const FileUploader = ({ onFileUpload }) => {
    const fileInputRef = useRef(null);
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileUpload(e.target.files[0]);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.endsWith('.txt')) {
                onFileUpload(file);
            }
            else {
                alert("Please upload a .txt file");
            }
        }
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    return (_jsx("div", { className: "max-w-2xl mx-auto mt-8 px-4", children: _jsxs("div", { className: "relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-whatsapp hover:bg-green-50 dark:hover:bg-gray-800 transition-colors cursor-pointer bg-white dark:bg-gray-800 shadow-sm", onDrop: handleDrop, onDragOver: handleDragOver, onClick: () => fileInputRef.current?.click(), children: [_jsx("div", { className: "flex justify-center", children: _jsx(UploadCloud, { className: "h-12 w-12 text-gray-400 dark:text-gray-500" }) }), _jsx("h3", { className: "mt-2 text-lg font-medium text-gray-900 dark:text-white", children: "Upload WhatsApp Chat" }), _jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Drag and drop your .txt file here, or click to browse" }), _jsx("p", { className: "mt-2 text-xs text-gray-400 dark:text-gray-500", children: "(Export from WhatsApp > Chat Info > Export Chat > Without Media)" }), _jsx("input", { type: "file", ref: fileInputRef, className: "hidden", accept: ".txt", onChange: handleFileChange }), _jsx("div", { className: "mt-6", children: _jsx("span", { className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-whatsapp hover:bg-whatsapp-dark shadow-sm", children: "Choose File" }) })] }) }));
};
export default FileUploader;
