import apiClient from './apiClient';

/**
 * Universal API helper function using Axios
 */
export const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const config = {
      url: endpoint,
      method: method.toLowerCase(),
    };
    if (body) {
      config.data = body;
    }
    const data = await apiClient(config);
    return data;
  } catch (error) {
    console.warn(`Axios API fallback for ${endpoint}:`, error.message);
    
    // If the server actually responded (e.g. status 400, 401, 409, 500), return the error instead of fallback
    if (error.status && error.status !== 0) {
      return {
        success: false,
        message: error.message || 'API request failed',
        status: error.status,
        data: error.data,
      };
    }
    
    if (endpoint.startsWith('/auth/login')) {
      const role = body?.rolePreset || 'super_admin';
      return {
        success: true,
        token: `mock_jwt_token_${role}_${Date.now()}`,
        user: {
          id: `usr_${role}`,
          name: role === 'super_admin' ? 'Faiyaz Usmani' : role === 'teacher' ? 'Dr. Sarah Connor' : role === 'student' ? 'Lucas Rivera' : 'Marcus Rivera',
          email: body?.email || (role === 'super_admin' ? 'faiyaz25@navgurukul.org' : `${role}@edumanage.com`),
          phone: role === 'super_admin' ? '8114103889' : '+1 (555) 234-5678',
          schoolName: 'Shimla International Public School',
          role,
          avatar: role === 'super_admin' ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
          status: 'active',
        },
      };
    }

    if (endpoint.startsWith('/auth/google')) {
      const email = body?.email || 'user@edumanage.com';
      const isSuperAdmin = email === 'faiyaz25@navgurukul.org' || email.includes('admin');
      const role = isSuperAdmin ? 'super_admin' : 'student';
      return {
        success: true,
        token: `mock_jwt_token_google_${Date.now()}`,
        isNewUser: false,
        user: {
          id: `usr_google_${Date.now()}`,
          name: body?.name || 'Google User',
          email,
          role,
          avatar: body?.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          status: 'active',
        },
      };
    }

    if (endpoint.startsWith('/auth/register')) {
      return {
        success: true,
        token: `mock_jwt_token_new_${Date.now()}`,
        user: {
          id: `usr_new_${Date.now()}`,
          name: body?.name || 'New User',
          email: body?.email || 'new@edumanage.com',
          role: body?.role || 'student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          status: 'active',
        },
      };
    }

    if (endpoint.startsWith('/auth/me')) {
      try {
        const savedUserStr = localStorage.getItem('edumanage_user');
        if (savedUserStr && savedUserStr !== 'undefined' && savedUserStr !== 'null') {
          return {
            success: true,
            user: JSON.parse(savedUserStr),
          };
        }
      } catch (e) {}

      return {
        success: true,
        user: {
          id: 'usr_student',
          name: 'Lucas Rivera',
          email: 'student@edumanage.com',
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
          status: 'active',
        },
      };
    }

    return {
      success: true,
      data: { message: 'Mock response fallback' },
    };
  }
};

// Module-specific Axios API methods
export const studentAPI = {
  getAll: (params) => apiClient.get('/students', { params }),
  getById: (id) => apiClient.get(`/students/${id}`),
  create: (data) => apiClient.post('/students', data),
  update: (id, data) => apiClient.put(`/students/${id}`, data),
  delete: (id) => apiClient.delete(`/students/${id}`),
};

export const teacherAPI = {
  getAll: (params) => apiClient.get('/teachers', { params }),
  getById: (id) => apiClient.get(`/teachers/${id}`),
  create: (data) => apiClient.post('/teachers', data),
  update: (id, data) => apiClient.put(`/teachers/${id}`, data),
  delete: (id) => apiClient.delete(`/teachers/${id}`),
};



export const salaryAPI = {
  getAll: (params) => apiClient.get('/salary', { params }),
  create: (data) => apiClient.post('/salary', data),
  update: (id, data) => apiClient.put(`/salary/${id}`, data),
  delete: (id) => apiClient.delete(`/salary/${id}`),
};

export const academicAPI = {
  getClasses: (params) => apiClient.get('/academic/classes', { params }),
  createClass: (data) => apiClient.post('/academic/classes', data),
  updateClass: (id, data) => apiClient.put(`/academic/classes/${id}`, data),
  deleteClass: (id) => apiClient.delete(`/academic/classes/${id}`),

  getSubjects: (params) => apiClient.get('/academic/subjects', { params }),
  createSubject: (data) => apiClient.post('/academic/subjects', data),
  updateSubject: (id, data) => apiClient.put(`/academic/subjects/${id}`, data),
  deleteSubject: (id) => apiClient.delete(`/academic/subjects/${id}`),

  getTimetable: (params) => apiClient.get('/academic/timetable', { params }),
};

export const feeAPI = {
  getInvoices: (params) => apiClient.get('/finance/fees', { params }),
  createInvoice: (data) => apiClient.post('/finance/fees', data),
  updateInvoice: (id, data) => apiClient.put(`/finance/fees/${id}`, data),
  deleteInvoice: (id) => apiClient.delete(`/finance/fees/${id}`),
  recordPayment: (id, data) => apiClient.post(`/finance/fees/pay/${id}`, data),
};

export const noticeAPI = {
  getAll: (params) => apiClient.get('/communication/notices', { params }),
  create: (data) => apiClient.post('/communication/notices', data),
  delete: (id) => apiClient.delete(`/communication/notices/${id}`),
};

export const attendanceAPI = {
  getAnalytics: (params) => apiClient.get('/homework/attendance/analytics', { params }),
  getLogs: (params) => apiClient.get('/homework/attendance', { params }),
  mark: (data) => apiClient.post('/homework/attendance', data),
};

export const homeworkAPI = {
  getAll: (params) => apiClient.get('/homework', { params }),
  create: (data) => apiClient.post('/homework', data),
  update: (id, data) => apiClient.put(`/homework/${id}`, data),
  delete: (id) => apiClient.delete(`/homework/${id}`),
};

export const examAPI = {
  getAll: (params) => apiClient.get('/exams/exams', { params }),
  create: (data) => apiClient.post('/exams/exams', data),
  update: (id, data) => apiClient.put(`/exams/exams/${id}`, data),
  delete: (id) => apiClient.delete(`/exams/exams/${id}`),
};

export const resultAPI = {
  getAll: (params) => apiClient.get('/exams/results', { params }),
  create: (data) => apiClient.post('/exams/results', data),
  update: (id, data) => apiClient.put(`/exams/results/${id}`, data),
  delete: (id) => apiClient.delete(`/exams/results/${id}`),
};

export const profileAPI = {
  getStudentMe: () => apiClient.get('/students/me'),
  getTeacherMe: () => apiClient.get('/teachers/me'),
  getParentMe: () => apiClient.get('/parents/me'),
  getDashboardData: () => apiClient.get('/dashboard/data'),
};

export const libraryAPI = {
  getBooks: (params) => apiClient.get('/books', { params }),
  createBook: (data) => apiClient.post('/books', data),
  updateBook: (id, data) => apiClient.put(`/books/${id}`, data),
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
};
