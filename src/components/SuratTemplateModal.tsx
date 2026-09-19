import React, { useState } from 'react';
import { X, FileText, Download, Copy, Check, Info } from 'lucide-react';
import { SURAT_PERMOHONAN_TEMPLATE, HALL_INFO } from '../data/constants';

interface SuratTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuratTemplateModal: React.FC<SuratTemplateModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SURAT_PERMOHONAN_TEMPLATE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDoc = () => {
    // Generate a downloadable text file formatted for Microsoft Word / Text editor
    const blob = new Blob([SURAT_PERMOHONAN_TEMPLATE], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Format_Surat_Permohonan_Gedung_Tammuan_Mali.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="surat-template-modal-backdrop"
      className="fixed inset-0 z-60 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div
        id="surat-template-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white px-6 py-5 flex items-center justify-between border-b border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block">
                Format Standar Resmi
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-stone-100">
                Template Surat Permohonan Pemakaian Gedung
              </h2>
            </div>
          </div>
          <button
            id="close-surat-template-modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5 max-h-[72vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <Info className="w-4 h-4 text-amber-700" />
              <span>Petunjuk Penggunaan Template Surat:</span>
            </div>
            <p className="leading-relaxed text-stone-700">
              Surat permohonan ini ditujukan kepada <strong>Kepala UPTD Pengelola Gedung Tammuan Mali' Makale</strong>. Salin atau unduh draf template di bawah ini, lengkapi data acara Anda, bubuhkan tanda tangan/stempel, lalu simpan dalam format <strong>PDF/DOC/Foto</strong> atau upload ke <strong>Google Drive</strong> untuk dilampirkan pada formulir booking.
            </p>
            <p className="pt-1.5 border-t border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <strong>Ketentuan Kebersihan:</strong> Pemohon/penanggung jawab bersedia mematuhi kewajiban mengumpulkan seluruh sampah setelah kegiatan ke dalam kantong plastik hitam yang disiapkan sendiri (retribusi sampah ke DLH sebesar Rp 200.000).
            </p>
          </div>

          {/* Text Area / Code Box */}
          <div className="relative border border-stone-300 rounded-2xl overflow-hidden bg-stone-50">
            <div className="bg-stone-200/80 px-4 py-2 border-b border-stone-300 flex items-center justify-between text-xs text-stone-600 font-medium">
              <span>Format_Surat_Permohonan_Gedung_Tammuan_Mali.doc</span>
              <span className="font-mono text-[11px]">Bahasa Indonesia</span>
            </div>
            <pre className="p-5 font-mono text-xs text-stone-800 leading-relaxed whitespace-pre-wrap select-all overflow-x-auto max-h-[380px]">
              {SURAT_PERMOHONAN_TEMPLATE}
            </pre>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-copy-template"
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Format Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-stone-600" />
                  <span>Salin Teks Format</span>
                </>
              )}
            </button>

            <button
              id="btn-download-template"
              onClick={handleDownloadDoc}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Template (.TXT)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
