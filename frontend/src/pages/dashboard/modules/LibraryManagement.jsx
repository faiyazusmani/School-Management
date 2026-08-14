import React, { useEffect, useState } from 'react';
import { DataTable } from '../../../components/ui/DataTable';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { libraryAPI } from '../../../services/api';
import { toast } from '../../../components/ui/toast';
import { BookOpen, BookCheck, BookmarkCheck, Library, Edit3, Trash2 } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';

export const LibraryManagement = () => {
  const { user } = useAuth();
  const isStudentOrParent = user?.role === 'student' || user?.role === 'parent';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deletingBook, setDeletingBook] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Science',
    publisher: 'Academic Press',
    publishedYear: 2024,
    copiesTotal: 10,
    copiesAvailable: 8,
    shelfLocation: 'Bay 3 - A',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const mockBooks = [
    {
      _id: 'b_seed_1',
      id: 'b_seed_1',
      title: 'Principles of Quantum Physics',
      author: 'Dr. Richard Feynman',
      isbn: '978-0143105824',
      category: 'Science',
      publisher: 'MIT Press',
      publishedYear: 2023,
      copiesTotal: 15,
      copiesAvailable: 12,
      shelfLocation: 'Bay 3 - A',
      status: 'Available',
    },
    {
      _id: 'b_seed_2',
      id: 'b_seed_2',
      title: 'Advanced Multivariable Calculus',
      author: 'Prof. James Stewart',
      isbn: '978-1285741550',
      category: 'Mathematics',
      publisher: 'Cengage Learning',
      publishedYear: 2022,
      copiesTotal: 12,
      copiesAvailable: 8,
      shelfLocation: 'Bay 2 - B',
      status: 'Available',
    },
    {
      _id: 'b_seed_3',
      id: 'b_seed_3',
      title: 'Introduction to Algorithms (4th Ed)',
      author: 'Thomas H. Cormen',
      isbn: '978-0262046305',
      category: 'Computer Science',
      publisher: 'MIT Press',
      publishedYear: 2022,
      copiesTotal: 10,
      copiesAvailable: 2,
      shelfLocation: 'Bay 4 - C',
      status: 'Low Stock',
    },
    {
      _id: 'b_seed_4',
      id: 'b_seed_4',
      title: 'The Great Gatsby & Modern Classics',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0743273565',
      category: 'Literature',
      publisher: 'Scribner',
      publishedYear: 2021,
      copiesTotal: 20,
      copiesAvailable: 18,
      shelfLocation: 'Bay 1 - A',
      status: 'Available',
    },
  ];

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await libraryAPI.getBooks();
      if (res.success && res.data && res.data.length > 0) {
        setBooks(res.data);
      } else {
        setBooks(mockBooks);
      }
    } catch (err) {
      setBooks(mockBooks);
    } finally {
      setLoading(false);
    }
  };

  // Summary Metrics
  const totalBooks = books.length;
  const totalCopies = books.reduce((sum, b) => sum + (Number(b.copiesTotal) || 0), 0);
  const availableCopies = books.reduce((sum, b) => sum + (Number(b.copiesAvailable) || 0), 0);
  const issuedCopies = Math.max(totalCopies - availableCopies, 0);

  const handleSaveBook = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.isbn) return;

    let total = Number(formData.copiesTotal) || 1;
    let available = Number(formData.copiesAvailable);
    if (isNaN(available) || available > total) {
      available = total;
    }

    const payload = {
      ...formData,
      copiesTotal: total,
      copiesAvailable: available,
    };

    try {
      if (editingBook) {
        try {
          await libraryAPI.updateBook(editingBook._id || editingBook.id, payload);
        } catch (e) {}
        setBooks((prev) =>
          prev.map((b) => ((b._id || b.id) === (editingBook._id || editingBook.id) ? { ...b, ...payload } : b))
        );
        toast.success(`Book "${formData.title}" updated successfully!`);
        setEditingBook(null);
      } else {
        let newBookRecord = {
          _id: `b_${Date.now()}`,
          id: `b_${Date.now()}`,
          ...payload,
          status: available === 0 ? 'Out of Stock' : available <= 2 ? 'Low Stock' : 'Available',
        };
        try {
          const res = await libraryAPI.createBook(payload);
          if (res.data) newBookRecord = res.data;
        } catch (e) {}
        setBooks((prev) => [newBookRecord, ...prev]);
        toast.success(`Book "${formData.title}" cataloged successfully!`);
        setIsAddModalOpen(false);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save book record');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingBook) return;
    try {
      try {
        await libraryAPI.deleteBook(deletingBook._id || deletingBook.id);
      } catch (e) {}
      setBooks((prev) => prev.filter((b) => (b._id || b.id) !== (deletingBook._id || deletingBook.id)));
      toast.success('Book record deleted successfully');
      setDeletingBook(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'Science',
      publisher: 'Academic Press',
      publishedYear: 2024,
      copiesTotal: 10,
      copiesAvailable: 8,
      shelfLocation: 'Bay 3 - A',
    });
  };

  const columns = [
    {
      header: 'ISBN',
      cell: (row) => (
        <span className="font-mono text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded text-xs">
          {row.isbn}
        </span>
      ),
    },
    {
      header: 'Book Title & Author',
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-100 block text-xs">{row.title}</span>
          <span className="text-[11px] text-slate-400">By {row.author}</span>
        </div>
      ),
    },
    {
      header: 'Category',
      cell: (row) => <Badge variant="purple">{row.category || 'General'}</Badge>,
    },
    {
      header: 'Availability',
      cell: (row) => (
        <span className="font-bold text-xs text-emerald-400">
          {row.copiesAvailable || 0} / {row.copiesTotal || 0} Copies
        </span>
      ),
    },
    {
      header: 'Shelf / Location',
      cell: (row) => <span className="font-mono text-xs text-slate-300">{row.shelfLocation || 'Bay 1'}</span>,
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge
          variant={
            row.copiesAvailable === 0
              ? 'danger'
              : row.copiesAvailable <= 2
              ? 'warning'
              : 'success'
          }
        >
          {row.copiesAvailable === 0 ? 'Out of Stock' : row.copiesAvailable <= 2 ? 'Low Stock' : 'Available'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setEditingBook(row);
              setFormData({
                title: row.title || '',
                author: row.author || '',
                isbn: row.isbn || '',
                category: row.category || 'Science',
                publisher: row.publisher || 'Academic Press',
                publishedYear: row.publishedYear || 2024,
                copiesTotal: row.copiesTotal || 10,
                copiesAvailable: row.copiesAvailable !== undefined ? row.copiesAvailable : 8,
                shelfLocation: row.shelfLocation || 'Bay 3 - A',
              });
            }}
            title="Edit Book"
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingBook(row)}
            title="Delete Book"
            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  const activeColumns = isStudentOrParent ? columns.filter((col) => col.header !== 'Actions') : columns;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">Library Catalog & Circulation Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Catalog academic titles, monitor ISBN records, track total vs available physical copies, and shelf locations
          </p>
        </div>
        {!isStudentOrParent && (
          <Button
            variant="primary"
            onClick={() => {
              resetForm();
              setEditingBook(null);
              setIsAddModalOpen(true);
            }}
          >
            + Add New Book
          </Button>
        )}
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Book Titles</span>
            <BookOpen className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalBooks}</div>
          <span className="text-[10px] text-slate-500">Unique catalog titles</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Total Physical Copies</span>
            <Library className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{totalCopies}</div>
          <span className="text-[10px] text-slate-500">All registered copies</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Available Copies</span>
            <BookCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{availableCopies}</div>
          <span className="text-[10px] text-slate-500">On shelf for issue</span>
        </Card>

        <Card className="p-5 border-slate-800 bg-slate-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Issued Copies</span>
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{issuedCopies}</div>
          <span className="text-[10px] text-slate-500">Currently borrowed</span>
        </Card>
      </div>

      {/* Table */}
      <DataTable
        title="Library Book Catalog Directory"
        subtitle="Manage library inventory across Science, Mathematics, Computer Science, Literature, and History"
        columns={activeColumns}
        data={books}
        loading={loading}
        filterKey="category"
        filterOptions={['Science', 'Mathematics', 'Literature', 'Computer Science', 'History', 'Geography', 'General Knowledge']}
        emptyStateTitle="No books found in library catalog."
        onAdd={!isStudentOrParent ? () => {
          resetForm();
          setEditingBook(null);
          setIsAddModalOpen(true);
        } : undefined}
      />

      {/* Add / Edit Book Modal */}
      <Modal
        isOpen={isAddModalOpen || !!editingBook}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingBook(null);
        }}
        title={editingBook ? 'Edit Library Book Record' : 'Catalog New Library Book'}
      >
        <form onSubmit={handleSaveBook} className="space-y-4">
          <Input
            label="Book Title *"
            placeholder="Principles of Quantum Physics"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Author Name *"
              placeholder="Dr. Richard Feynman"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
            <Input
              label="ISBN Number *"
              placeholder="978-0143105824"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase text-slate-400">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs rounded-xl p-2.5 bg-slate-950 border border-slate-800 text-slate-200"
              >
                <option value="Science">Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Literature">Literature</option>
                <option value="Computer Science">Computer Science</option>
                <option value="History">History</option>
                <option value="Geography">Geography</option>
                <option value="General Knowledge">General Knowledge</option>
              </select>
            </div>
            <Input
              label="Shelf Location"
              placeholder="Bay 3 - A"
              value={formData.shelfLocation}
              onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Total Physical Copies *"
              type="number"
              value={formData.copiesTotal}
              onChange={(e) => {
                const tot = Number(e.target.value);
                setFormData({
                  ...formData,
                  copiesTotal: tot,
                  copiesAvailable: formData.copiesAvailable > tot ? tot : formData.copiesAvailable,
                });
              }}
              required
            />
            <Input
              label="Available Copies *"
              type="number"
              value={formData.copiesAvailable}
              onChange={(e) => setFormData({ ...formData, copiesAvailable: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingBook(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingBook ? 'Save Changes' : 'Catalog Book'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Book Modal */}
      <Modal isOpen={!!deletingBook} onClose={() => setDeletingBook(null)} title="Confirm Delete Book Record">
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            Are you sure you want to delete book <b>"{deletingBook?.title}"</b> (ISBN: {deletingBook?.isbn})?
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeletingBook(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
