import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Printer, GraduationCap, CheckCircle2, Download } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const FeeReceiptModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Tuition Payment Receipt">
      <div className="space-y-6">
        {/* Receipt Voucher */}
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">EduManage Pro Academy</h4>
                <p className="text-[10px] text-slate-400">750 Academic Parkway, CA 94107</p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success">PAYMENT COMPLETED</Badge>
              <p className="text-[10px] text-slate-400 mt-1 font-mono">{invoice.invoiceNumber || 'INV-2026-001'}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Billed To:</span>
              <p className="font-bold text-white">{invoice.studentName}</p>
              <p className="text-[11px] font-mono text-slate-400">Roll #{invoice.rollNumber}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Payment Method:</span>
              <p className="font-bold text-white">{invoice.paymentMethod || 'Online Credit Card'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Txn Ref: #TXN-984210</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                <tr>
                  <td className="p-2.5 font-medium">{invoice.title || 'Term Tuition Fee'}</td>
                  <td className="p-2.5 text-right font-bold">₹{invoice.amount?.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-900 font-bold text-white">
                  <td className="p-2.5 text-right">Total Paid:</td>
                  <td className="p-2.5 text-right text-emerald-400">₹{invoice.amount?.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Download PDF Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
