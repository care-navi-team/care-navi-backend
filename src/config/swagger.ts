import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Care Navi Backend API',
      version: '1.0.0',
      description: '케어 네비게이션 시스템 백엔드 API 문서',
      contact: {
        name: 'API Support',
        email: 'support@carenavi.com'
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || 'your-app.railway.app'}`
          : 'http://localhost:3000',
        description: process.env.NODE_ENV === 'production' ? '프로덕션 서버' : '개발 서버'
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'password', 'phoneNumber', 'birthDate', 'userType'],
          properties: {
            _id: {
              type: 'string',
              description: '사용자 ID'
            },
            name: {
              type: 'string',
              description: '사용자 이름',
              maxLength: 50
            },
            password: {
              type: 'string',
              minLength: 6,
              description: '비밀번호'
            },
            phoneNumber: {
              type: 'string',
              description: '전화번호 (필수, 유니크)'
            },
            birthDate: {
              type: 'string',
              format: 'date',
              description: '생년월일 (YYYY-MM-DD)'
            },
            userType: {
              type: 'string',
              enum: ['patient', 'caregiver', 'admin'],
              description: '사용자 유형'
            },
            isActive: {
              type: 'boolean',
              description: '활성 상태'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '생성일'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '수정일'
            }
          }
        },
        CareRequest: {
          type: 'object',
          required: ['patient', 'title', 'description', 'careType', 'scheduledDate', 'duration', 'location'],
          properties: {
            _id: {
              type: 'string',
              description: '케어 요청 ID'
            },
            patient: {
              type: 'string',
              description: '환자 ID'
            },
            caregiver: {
              type: 'string',
              description: '케어기버 ID'
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: '케어 제목'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: '케어 상세 내용'
            },
            careType: {
              type: 'string',
              enum: ['medical', 'daily', 'emergency', 'companion'],
              description: '케어 유형'
            },
            urgency: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: '긴급도'
            },
            status: {
              type: 'string',
              enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
              description: '상태'
            },
            scheduledDate: {
              type: 'string',
              format: 'date-time',
              description: '예정일'
            },
            duration: {
              type: 'number',
              minimum: 30,
              description: '예상 소요시간 (분)'
            },
            location: {
              type: 'object',
              properties: {
                address: {
                  type: 'string',
                  description: '주소'
                },
                latitude: {
                  type: 'number',
                  description: '위도'
                },
                longitude: {
                  type: 'number',
                  description: '경도'
                }
              }
            },
            requirements: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: '요구사항'
            },
            budget: {
              type: 'number',
              minimum: 0,
              description: '예산'
            },
            notes: {
              type: 'string',
              maxLength: 300,
              description: '비고'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: '생성일'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: '수정일'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: '성공 여부'
            },
            message: {
              type: 'string',
              description: '메시지'
            },
            data: {
              description: '응답 데이터'
            },
            count: {
              type: 'number',
              description: '데이터 개수'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: '에러 메시지'
                },
                stack: {
                  type: 'string',
                  description: '스택 트레이스 (개발 환경에서만)'
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };