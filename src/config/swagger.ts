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
        Survey: {
          type: 'object',
          required: ['title', 'description', 'category'],
          properties: {
            _id: {
              type: 'string',
              description: '설문 ID'
            },
            title: {
              type: 'string',
              maxLength: 100,
              description: '설문 제목'
            },
            description: {
              type: 'string',
              maxLength: 500,
              description: '설문 설명'
            },
            category: {
              type: 'string',
              enum: ['exercise', 'nutrition', 'mental_health', 'lifestyle'],
              description: '설문 카테고리'
            },
            version: {
              type: 'string',
              description: '버전'
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
        Question: {
          type: 'object',
          required: ['surveyId', 'questionNumber', 'questionText', 'options'],
          properties: {
            _id: {
              type: 'string',
              description: '문항 ID'
            },
            surveyId: {
              type: 'string',
              description: '설문 ID'
            },
            questionNumber: {
              type: 'number',
              minimum: 1,
              description: '문항 번호'
            },
            questionText: {
              type: 'string',
              maxLength: 500,
              description: '문항 내용'
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: {
                    type: 'string',
                    description: '선택지 텍스트'
                  },
                  score: {
                    type: 'number',
                    minimum: 0,
                    description: '점수'
                  }
                }
              },
              description: '선택지 목록'
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
        SurveyResponse: {
          type: 'object',
          required: ['userId', 'surveyId', 'answers', 'totalScore'],
          properties: {
            _id: {
              type: 'string',
              description: '응답 ID'
            },
            userId: {
              type: 'string',
              description: '사용자 ID'
            },
            surveyId: {
              type: 'string',
              description: '설문 ID'
            },
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  questionId: {
                    type: 'string',
                    description: '문항 ID'
                  },
                  selectedOptionIndex: {
                    type: 'number',
                    minimum: 0,
                    description: '선택한 옵션 인덱스'
                  },
                  score: {
                    type: 'number',
                    minimum: 0,
                    description: '점수'
                  }
                }
              },
              description: '답변 목록'
            },
            totalScore: {
              type: 'number',
              minimum: 0,
              description: '총점'
            },
            resultId: {
              type: 'string',
              description: '결과 ID'
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              description: '완료일'
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
        SurveyResult: {
          type: 'object',
          required: ['surveyId', 'minScore', 'maxScore', 'level', 'levelText', 'summary', 'consulting'],
          properties: {
            _id: {
              type: 'string',
              description: '결과 ID'
            },
            surveyId: {
              type: 'string',
              description: '설문 ID'
            },
            minScore: {
              type: 'number',
              minimum: 0,
              description: '최소 점수'
            },
            maxScore: {
              type: 'number',
              minimum: 0,
              description: '최대 점수'
            },
            level: {
              type: 'string',
              enum: ['excellent', 'good', 'caution', 'warning', 'critical'],
              description: '결과 레벨'
            },
            levelText: {
              type: 'string',
              maxLength: 50,
              description: '레벨 텍스트'
            },
            summary: {
              type: 'string',
              maxLength: 1000,
              description: '요약문'
            },
            consulting: {
              type: 'array',
              items: {
                type: 'string',
                maxLength: 500
              },
              description: '생활 컨설팅 목록'
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