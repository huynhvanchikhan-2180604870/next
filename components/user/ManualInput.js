'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassButton from '../ui/GlassButton';
import { Plus, X, Users } from 'lucide-react';

export default function ManualInput({ onNamesProcessed }) {
  const [names, setNames] = useState(['']);
  const [textInput, setTextInput] = useState('');
  const [inputMode, setInputMode] = useState('individual'); // 'individual' or 'bulk'

  const addNameField = () => {
    setNames([...names, '']);
  };

  const removeNameField = (index) => {
    if (names.length > 1) {
      setNames(names.filter((_, i) => i !== index));
    }
  };

  const updateName = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const validateVietnameseName = (name) => {
    const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
    return vietnameseNameRegex.test(name.trim()) && name.trim().length >= 2 && name.trim().length <= 50;
  };

  const handleSubmit = () => {
    let processedNames = [];

    if (inputMode === 'individual') {
      processedNames = names
        .map(name => name.trim())
        .filter(name => name.length > 0 && validateVietnameseName(name));
    } else {
      processedNames = textInput
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0 && validateVietnameseName(name));
    }

    if (processedNames.length === 0) {
      alert('Vui lòng nhập ít nhất một tên hợp lệ');
      return;
    }

    // Add index to each name
    const namesWithIndex = processedNames.map((name, index) => ({
      index: index + 1,
      fullName: name
    }));
    
    onNamesProcessed(namesWithIndex, 'manual');
  };

  return (
    <div className="space-y-6">
      {/* Input Mode Toggle */}
      <div className="flex space-x-2 bg-white/10 backdrop-blur-sm rounded-xl p-1">
        <button
          onClick={() => setInputMode('individual')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'individual'
              ? 'bg-white/20 text-gray-800'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Nhập từng tên
        </button>
        <button
          onClick={() => setInputMode('bulk')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
            inputMode === 'bulk'
              ? 'bg-white/20 text-gray-800'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Nhập hàng loạt
        </button>
      </div>

      {inputMode === 'individual' ? (
        <div className="space-y-3">
          {names.map((name, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(index, e.target.value)}
                  placeholder={`Tên ${index + 1}`}
                  className="w-full glass-input"
                />
              </div>
              {names.length > 1 && (
                <button
                  onClick={() => removeNameField(index)}
                  className="p-2 text-red-500 hover:bg-red-100/20 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
          
          <GlassButton
            onClick={addNameField}
            variant="secondary"
            className="w-full flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm tên</span>
          </GlassButton>
        </div>
      ) : (
        <div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Nhập danh sách tên, mỗi tên một dòng..."
            rows={10}
            className="w-full glass-input resize-none"
          />
          <p className="text-sm text-gray-600 mt-2">
            Mỗi tên trên một dòng. Ví dụ:
            <br />
            Nguyễn Văn A
            <br />
            Trần Thị B
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span className="text-sm">
            {inputMode === 'individual' 
              ? `${names.filter(n => n.trim()).length} tên`
              : `${textInput.split('\n').filter(n => n.trim()).length} tên`
            }
          </span>
        </div>
        
        <GlassButton onClick={handleSubmit}>
          Xử lý danh sách
        </GlassButton>
      </div>
    </div>
  );
}