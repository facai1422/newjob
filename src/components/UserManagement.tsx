import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit, Trash2, Shield, Mail, Calendar, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PasswordVerifyModal } from './PasswordVerifyModal';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    provider?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  role?: string;
  email_confirmed_at?: string;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProvider, setFilterProvider] = useState('all');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'edit' | 'delete' | 'modify';
    user: User;
    action: () => void;
  } | null>(null);

  // 获取用户列表
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // 使用 Supabase Admin API 获取用户列表
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error('获取用户列表失败:', error);
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error('获取用户列表错误:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 过滤用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProvider = filterProvider === 'all' || 
      user.app_metadata?.provider === filterProvider;

    return matchesSearch && matchesProvider;
  });

  // 删除用户
  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error('删除用户失败:', error);
        alert('删除用户失败: ' + error.message);
        return;
      }

      alert('用户删除成功');
      fetchUsers(); // 重新获取用户列表
    } catch (error) {
      console.error('删除用户错误:', error);
      alert('删除用户失败');
    }
  };

  // 密码验证成功后的处理
  const handlePasswordConfirm = () => {
    if (pendingAction) {
      pendingAction.action();
      setPendingAction(null);
    }
  };

  // 需要密码验证的操作
  const requirePasswordAction = (type: 'edit' | 'delete' | 'modify', user: User, action: () => void) => {
    setPendingAction({ type, user, action });
    setShowPasswordModal(true);
  };

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  // 获取提供商图标
  const getProviderIcon = (provider?: string) => {
    switch (provider) {
      case 'google':
        return '🔍';
      case 'email':
        return '📧';
      default:
        return '👤';
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
            <p className="text-gray-600">管理系统用户账户和权限</p>
          </div>
        </div>
        
        <div className="bg-gray-100 px-4 py-2 rounded-lg">
          <span className="text-sm text-gray-600">总用户数: </span>
          <span className="font-bold text-blue-600">{users.length}</span>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索用户邮箱或姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* 提供商筛选 */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterProvider}
              onChange={(e) => setFilterProvider(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              title="按提供商筛选"
              aria-label="按提供商筛选用户"
            >
              <option value="all">所有提供商</option>
              <option value="email">邮箱注册</option>
              <option value="google">Google登录</option>
            </select>
          </div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">加载用户列表中...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>未找到用户</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户信息
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册方式
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    最后登录
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* 用户信息 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.user_metadata?.avatar_url ? (
                            <img
                              className="h-10 w-10 rounded-full"
                              src={user.user_metadata.avatar_url}
                              alt="头像"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.user_metadata?.full_name || '未设置姓名'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 注册方式 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getProviderIcon(user.app_metadata?.provider)}
                        </span>
                        <span className="text-sm text-gray-900 capitalize">
                          {user.app_metadata?.provider === 'email' ? '邮箱' : 
                           user.app_metadata?.provider === 'google' ? 'Google' : 
                           user.app_metadata?.provider || '未知'}
                        </span>
                      </div>
                    </td>

                    {/* 注册时间 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </div>
                    </td>

                    {/* 最后登录 */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : '从未登录'}
                    </td>

                    {/* 状态 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.email_confirmed_at
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {user.email_confirmed_at ? '已验证' : '未验证'}
                      </span>
                    </td>

                    {/* 操作 */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => requirePasswordAction('edit', user, () => {
                            alert(`编辑用户: ${user.email}（功能开发中）`);
                          })}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded"
                          title="编辑用户"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requirePasswordAction('delete', user, () => {
                            if (window.confirm(`确定要删除用户 ${user.email} 吗？此操作不可恢复！`)) {
                              handleDeleteUser(user.id);
                            }
                          })}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded"
                          title="删除用户"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 密码验证模态框 */}
      <PasswordVerifyModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingAction(null);
        }}
        onConfirm={handlePasswordConfirm}
        title={
          pendingAction?.type === 'delete' ? '删除用户' :
          pendingAction?.type === 'edit' ? '编辑用户' :
          '修改用户'
        }
        description={
          pendingAction ? 
          `您即将对用户 "${pendingAction.user.email}" 执行${
            pendingAction.type === 'delete' ? '删除' :
            pendingAction.type === 'edit' ? '编辑' : '修改'
          }操作` : ''
        }
        actionType={pendingAction?.type || 'edit'}
      />
    </div>
  );
}
