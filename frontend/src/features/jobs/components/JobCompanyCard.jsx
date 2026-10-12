import React from 'react';
import { Building2, ExternalLink, MessageSquare } from 'lucide-react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import fileService from '../../../services/fileService';

export default function JobCompanyCard({ company, onOpenReview }) {
  if (!company) return null;

  return (
    <Card className="shadow-none border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
          {company.logoUrl ? (
            <img src={fileService.getFullFileUrl(company.logoUrl)} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-6 h-6 text-slate-400" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{company.name}</h3>
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-slate-500 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span>{company.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {company.description && (
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {company.description}
        </p>
      )}

      <div className="pt-2 border-t border-slate-100">
        <Button
          variant="outline"
          size="sm"
          isFullWidth
          onClick={onOpenReview}
          leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
        >
          Viết đánh giá công ty
        </Button>
      </div>
    </Card>
  );
}
