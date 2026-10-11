import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import notificationService from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

/**
 * Component Chuông thông báo toàn hệ thống (Task 5.1 / Phase 5)
 */
export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const dropdownRef = useRef(null);

  // 1. Tải số lượng thông báo chưa đọc
  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await notificationService.getUnreadCount();
      setUnreadCount(res?.count || 0);
    } catch (err) {
      console.error('Lỗi khi tải số thông báo chưa đọc:', err);
    }
  };

  // 2. Tải danh sách thông báo khi mở dropdown
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await notificationService.getMyNotifications({ page: 0, size: 8 });
      setNotifications(res?.content || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách thông báo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Polling unread count mỗi 30 giây (Task 5.1)
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Khi mở dropdown thì load danh sách
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 3. Đánh dấu đã đọc khi click vào thông báo
  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Lỗi khi đánh dấu đã đọc:', err);
    }
  };

  // 4. Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = async () => {
    const unreadItems = notifications.filter((n) => !n.isRead);
    if (unreadItems.length === 0) return;

    try {
      setIsMarkingAll(true);
      await Promise.all(unreadItems.map((n) => notificationService.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Lỗi khi đánh dấu tất cả đã đọc:', err);
    } finally {
      setIsMarkingAll(false);
    }
  };

  // Format thời gian ngắn
  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút chuông */}
      <button
        type="button"
        aria-label="Thông báo"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-[#6B6152] hover:text-[#1E1E1E] rounded-xl hover:bg-[#FAF7F2] relative transition-colors cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border border-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown danh sách thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#EFE9DF] rounded-3xl shadow-xl py-3 z-50 text-xs">
          <div className="px-4 py-2 border-b border-[#F4EFE6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1E1E1E]">Thông báo hệ thống</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C4A08] border border-[#E8E2D6] text-[10px] font-semibold">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAll}
                className="text-[11px] text-[#8C4A08] hover:underline flex items-center gap-1 font-semibold cursor-pointer disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Đã đọc hết</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#F4EFE6]">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-[#8A8073]">
                <Loader2 className="w-5 h-5 animate-spin text-[#F6B779] mb-2" />
                <span>Đang tải thông báo...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-[#8A8073]">
                <p className="text-xs">Chưa có thông báo nào dành cho bạn</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id, n.isRead)}
                  className={`p-3.5 hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer flex items-start gap-3 ${
                    !n.isRead ? 'bg-[#FAF7F2]/40 font-medium' : ''
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      !n.isRead ? 'bg-[#F6B779]' : 'bg-transparent'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs text-[#2C241E] leading-relaxed ${!n.isRead ? 'font-semibold' : ''}`}>
                      {n.content || n.message}
                    </p>
                    <span className="text-[10px] text-[#8A8073] mt-1 block">
                      {formatTime(n.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
