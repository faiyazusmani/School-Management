import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Printer, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ReportCardModal = ({ isOpen, onClose, student }) => {
  if (!student) return null;

  const subjects = [
    { name: 'Advanced Physics', score: 94, max: 100, grade: 'A', remarks: 'Outstanding laboratory work' },
    { name: 'AP Calculus BC', score: 91, max: 100, grade: 'A-', remarks: 'Excellent problem solving' },
    { name: 'World Literature', score: 95, max: 100, grade: 'A', remarks: 'Insightful essay writing' },
    { name: 'Computer Science', score: 99, max: 100, grade: 'A+', remarks: 'Top class performance' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Official Academic Transcript & Report Card">
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">SCHOLARHUB ACADEMY</h4>
                <p className="text-[10px] text-slate-400">Term 1 Official Student Report Card</p>
              </div>
            </div>
            <Badge variant="purple">GPA: 3.88 / 4.0</Badge>
          </div>

          {/* Student Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900 p-3 rounded-xl text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Student Name</span>
              <span className="font-bold text-white">{student.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Grade & Roll</span>
              <span className="font-bold text-white">{student.gradeLevel || 'Grade 11-A'} (#{student.rollNumber || '101'})</span>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[10px] text-slate-500 block uppercase">Attendance</span>
              <span className="font-bold text-emerald-400">96.2%</span>
            </div>
          </div>

          {/* Marks Table */}
          <div className="border border-slate-800 rounded-xl overflow-x-auto min-w-0 max-w-full">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="p-2">Subject Name</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Grade</th>
                  <th className="p-2">Teacher Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {subjects.map((sub, i) => (
                  <tr key={i}>
                    <td className="p-2 font-semibold">{sub.name}</td>
                    <td className="p-2 font-mono">{sub.score} / {sub.max}</td>
                    <td className="p-2 font-bold text-emerald-400">{sub.grade}</td>
                    <td className="p-2 text-slate-400">{sub.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          <div className="pt-4 border-t border-slate-800 flex justify-between text-[10px] text-slate-400">
            <div>
              <p className="font-semibold text-slate-200">Dr. Sarah Connor</p>
              <p>Faculty Department Lead</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-200">Dr. Arthur Pendelton</p>
              <p>Academy Principal Signature</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-1" /> Download Transcript PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
