import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const DataTable = ({
  columns = [],
  data = [],
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  filterOptions = [],
  filterKey,
  onAdd,
  onEdit,
  onDelete,
  onView,
  loading = false,
  pageSize = 6,
  emptyStateTitle,
  emptyStateDescription,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter & Search computation
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter key match
      if (selectedFilter !== 'ALL' && filterKey && item[filterKey] !== selectedFilter) {
        return false;
      }
      // Search term match across all object string values
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return Object.values(item).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        );
      }
      return true;
    });
  }, [data, searchTerm, selectedFilter, filterKey]);

  // Pagination computation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 dark:bg-slate-900 light:bg-white light:border-slate-200">
        <div>
          {title && <h3 className="text-base sm:text-lg font-bold text-slate-100 dark:text-white light:text-slate-900">{title}</h3>}
          {subtitle && <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 light:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto text-xs rounded-xl pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-950 dark:border-slate-800 light:bg-slate-100 light:border-slate-300 light:text-slate-900"
            />
          </div>

          {/* Filter Select */}
          {filterOptions.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300">
              <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">All Categories</option>
                {filterOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-slate-900 text-slate-200">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Add New Action */}
          {onAdd && (
            <Button size="sm" variant="primary" onClick={onAdd}>
              <Plus className="w-4 h-4 mr-1" /> Add New
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden dark:bg-slate-900 dark:border-slate-800 light:bg-white light:border-slate-200 min-w-0 max-w-full">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
    ) : paginatedData.length === 0 ? (
      <EmptyState
        title={emptyStateTitle || "No Matching Records"}
        description={emptyStateDescription || "Try adjusting your search query or filter selection."}
      />
    ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 light:bg-slate-50 light:border-slate-200">
                  {columns.map((col, idx) => (
                    <th key={idx} className="py-3.5 px-4 whitespace-nowrap">
                      {col.header}
                    </th>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-200 dark:divide-slate-800 light:divide-slate-200 light:text-slate-800">
                {paginatedData.map((row, rIdx) => (
                  <tr key={row.id || rIdx} className="hover:bg-slate-800/30 transition-colors">
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="py-3.5 px-4 whitespace-nowrap">
                        {col.cell ? col.cell(row) : row[col.accessor]}
                      </td>
                    ))}

                    {(onEdit || onDelete || onView) && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {onView && (
                            <button
                              onClick={() => onView(row)}
                              aria-label="View record details"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              aria-label="Edit record"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                              title="Edit Record"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              aria-label="Delete record"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Controls */}
        {!loading && filteredData.length > 0 && (
          <div className="p-3.5 sm:p-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:border-slate-800 light:border-slate-200">
            <span className="text-center sm:text-left">
              Showing <b>{Math.min((currentPage - 1) * pageSize + 1, filteredData.length)}</b> to{' '}
              <b>{Math.min(currentPage * pageSize, filteredData.length)}</b> of <b>{filteredData.length}</b> records
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-semibold text-slate-200">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
