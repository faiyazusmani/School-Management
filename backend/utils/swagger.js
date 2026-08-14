const swaggerDocs = (app) => {
  app.get('/api/docs', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'EduManage Pro Enterprise REST API',
        version: '2.5.0',
        description: 'Production-ready School Management System API with JWT Authentication, RBAC, and Audit Logging.',
      },
      paths: {
        '/api/auth/login': {
          post: {
            summary: 'Authenticate user & return JWT token',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      email: { type: 'string', example: 'admin@edumanage.com' },
                      password: { type: 'string', example: 'password123' },
                    },
                  },
                },
              },
            },
            responses: {
              200: { description: 'Authenticated successfully' },
            },
          },
        },
        '/api/students': {
          get: { summary: 'Get paginated student directory with search & filter' },
          post: { summary: 'Enroll new student' },
        },
        '/api/teachers': {
          get: { summary: 'Get faculty teacher directory' },
        },
        '/api/finance/fees': {
          get: { summary: 'Get tuition fee invoices' },
        },
      },
    });
  });
};

module.exports = swaggerDocs;
