import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface PasswordVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  actionType: 'edit' | 'delete' | 'modify';
}

const ADMIN_PASSWORD = '888990';

export function PasswordVerifyModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType
}: PasswordVerifyModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 验证密码
    if (password === ADMIN_PASSWORD) {
      setTimeout(() => {
        setIsLoading(false);
        onConfirm();
        handleClose();
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError('操作密码错误，请重试');
        setPassword('');
      }, 500);
    }
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  const getActionColor = () => {
    switch (actionType) {
      case 'delete':
        return 'red';
      case 'edit':
        return 'blue';
      case 'modify':
        return 'green';
      default:
        return 'blue';
    }
  };

  const getActionIcon = () => {
    switch (actionType) {
      case 'delete':
        return '🗑️';
      case 'edit':
        return '✏️';
      case 'modify':
        return '🔧';
      default:
        return '🔒';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* 模态框 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* 头部 */}
            <div className={`bg-${getActionColor()}-500 text-white p-6 relative`}>
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                title="关闭"
                aria-label="关闭对话框"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getActionIcon()}</div>
                <div>
                  <h2 className="text-xl font-bold">{title}</h2>
                  <p className="text-white/90 text-sm mt-1">{description}</p>
                </div>
              </div>
            </div>

            {/* 内容 */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 密码输入 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    操作密码 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="请输入操作密码"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 错误提示 */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* 警告提示 */}
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span className="font-medium">安全提醒</span>
                  </div>
                  <p className="mt-1">此操作需要管理员权限验证，请确认您有权限执行此操作。</p>
                </div>

                {/* 按钮组 */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={!password || isLoading}
                    className={`flex-1 px-4 py-3 bg-${getActionColor()}-500 hover:bg-${getActionColor()}-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        验证中...
                      </>
                    ) : (
                      '确认执行'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
