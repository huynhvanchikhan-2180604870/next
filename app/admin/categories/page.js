'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../../components/ui/GlassCard';
import GlassButton from '../../../components/ui/GlassButton';
import GlassInput from '../../../components/ui/GlassInput';
import DataTable from '../../../components/ui/DataTable';
import { Plus, Edit, Trash2, Eye, EyeOff, X } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = '/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory 
        ? { ...formData, id: editingCategory._id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        fetchCategories();
        setShowForm(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActive = async (category) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('/api/admin/categories', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: category._id,
          name: category.name,
          description: category.description,
          isActive: !category.isActive
        })
      });
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteCategory = async (id) => {
    if (confirm('Xác nhận xóa category này?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/admin/categories?id=${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchCategories();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const columns = [
    { accessor: 'name', header: 'Tên' },
    { accessor: 'description', header: 'Mô tả' },
    {
      accessor: 'isActive',
      header: 'Trạng thái',
      render: (category) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {category.isActive ? 'Hoạt động' : 'Ẩn'}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục</h1>
        <GlassButton
          onClick={() => {
            setShowForm(true);
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </GlassButton>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <GlassInput
                label="Tên danh mục"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <GlassInput
                label="Mô tả"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
              />
              <div className="flex space-x-3">
                <GlassButton type="submit">
                  {editingCategory ? 'Cập nhật' : 'Tạo mới'}
                </GlassButton>
                <GlassButton
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Hủy
                </GlassButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      )}

      <GlassCard>
        <DataTable
          data={categories}
          columns={columns}
          loading={loading}
          actions={(category) => (
            <div className="flex space-x-2">
              <button
                onClick={() => toggleActive(category)}
                className="p-1 text-blue-600 hover:bg-blue-100 rounded"
              >
                {category.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setFormData({ name: category.name, description: category.description || '' });
                  setShowForm(true);
                }}
                className="p-1 text-yellow-600 hover:bg-yellow-100 rounded"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteCategory(category._id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </GlassCard>
    </div>
  );
}