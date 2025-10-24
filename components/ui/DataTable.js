'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import GlassButton from './GlassButton';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

export default function DataTable({ 
  data = [], 
  columns = [], 
  loading = false,
  pagination = null,
  onPageChange = () => {},
  searchable = false,
  onSearch = () => {},
  actions = null
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Dữ liệu ({data.length})
          </h3>
          
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
                className="glass-input pl-10 w-64"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700 uppercase tracking-wider">
                  Thao tác
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="hover:bg-white/5 transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {column.render ? column.render(row) : (
                      <span className="text-sm text-gray-800">
                        {row[column.accessor]}
                      </span>
                    )}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {actions(row)}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Không có dữ liệu</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-white/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị {((pagination.page - 1) * pagination.limit) + 1} - {' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} trong {' '}
              {pagination.total} kết quả
            </div>
            
            <div className="flex items-center space-x-2">
              <GlassButton
                variant="secondary"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="p-2"
              >
                <ChevronLeft className="w-4 h-4" />
              </GlassButton>
              
              <span className="text-sm text-gray-700 px-3">
                Trang {pagination.page} / {pagination.pages}
              </span>
              
              <GlassButton
                variant="secondary"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="p-2"
              >
                <ChevronRight className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}