import * as XLSX from 'xlsx';

export const parseFileContent = (file, fileType) => {
  try {
    let names = [];

    if (fileType === 'txt') {
      const content = file.toString('utf8');
      names = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    } 
    else if (fileType === 'json') {
      const content = JSON.parse(file.toString('utf8'));
      if (Array.isArray(content)) {
        names = content.map(item => 
          typeof item === 'string' ? item.trim() : item.name || item.fullName || ''
        ).filter(name => name.length > 0);
      }
    }
    else if (fileType === 'xlsx' || fileType === 'xls') {
      const workbook = XLSX.read(file, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      names = data.flat()
        .map(cell => String(cell).trim())
        .filter(name => name.length > 0);
    }

    const validNames = names.filter(name => validateVietnameseName(name));
    const namesWithIndex = validNames.map((name, index) => ({
      index: index + 1,
      fullName: name
    }));
    
    return {
      success: true,
      names: namesWithIndex
    };
  } catch (error) {
    return {
      success: false,
      error: 'Lỗi khi xử lý file'
    };
  }
};

export const validateVietnameseName = (name) => {
  // Regex cho tên tiếng Việt
  const vietnameseNameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
  return vietnameseNameRegex.test(name) && name.length >= 2 && name.length <= 50;
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const getStatusText = (status) => {
  const statusMap = {
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    completed: 'Hoàn thành',
    rejected: 'Từ chối'
  };
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};