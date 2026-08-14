import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Printer, GraduationCap, QrCode, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const IDCardModal = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Student ID Card Generator">
      <div className="space-y-6">
        {/* Printable ID Card Graphic Badge */}
        <div className="id-card-printable max-w-sm mx-auto p-6 rounded-3xl bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-2xl space-y-5 relative overflow-hidden text-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-black tracking-tight block leading-tight">
                  SCHOLARHUB ACADEMY
                </span>
                <span className="text-[9px] uppercase font-bold text-indigo-300">
                  Official Student Identification
                </span>
              </div>
            </div>
            <Badge variant="success" className="text-[9px]">2026-2027</Badge>
          </div>

          {/* Student Photo & Details */}
          <div className="flex items-center gap-4">
            <img
              src={student?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
              alt={student?.name || 'Student'}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
            />
            <div className="space-y-1 text-xs">
              <h3 className="text-base font-extrabold text-white">{student.name}</h3>
              <p className="text-indigo-300 font-semibold">{student.gradeLevel || 'Grade 11-A'}</p>
              <p className="text-[11px] font-mono text-slate-400">ID #: {student.rollNumber || 'ST-101'}</p>
              <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED STUDENT
              </p>
            </div>
          </div>

          {/* QR Code & Barcode Block */}
          <div className="pt-3 border-t border-indigo-500/30 flex items-center justify-between">
            <div className="space-y-1 text-[10px] text-slate-400">
              <p>Blood Group: <b>O+</b></p>
              <p>Emergency Contact: <b>+1 (800) 555-EDUPRO</b></p>
            </div>
            {/* SVG Simulated QR Code */}
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              <QrCode className="w-10 h-10 text-slate-950" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-1" /> Print ID Card
          </Button>
        </div>
      </div>
    </Modal>
  );
};
