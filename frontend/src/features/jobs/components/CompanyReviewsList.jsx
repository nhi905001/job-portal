import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import Card from '../../../components/common/Card';
import { formatDate } from '../../../utils/formatters';

export default function CompanyReviewsList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <Card className="shadow-none border-slate-200 p-6 text-center text-slate-500">
        <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <p className="text-xs font-semibold text-slate-800">Chưa có đánh giá nào cho doanh nghiệp này</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Hãy là người đầu tiên để lại nhận xét chân thực!</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
        Đánh giá từ cộng đồng ({reviews.length})
      </h3>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-3.5 bg-slate-50 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-900">{rev.user?.fullName || 'Ứng viên ẩn danh'}</span>
              <span className="text-[11px] text-slate-400">{formatDate(rev.createdAt)}</span>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                  }`}
                />
              ))}
            </div>

            <p className="text-slate-700 leading-relaxed italic mt-1">"{rev.comment}"</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
