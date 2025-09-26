import Survey from '../models/Survey';
import Question from '../models/Question';
import SurveyResult from '../models/SurveyResult';

export const seedExerciseSurveyData = async () => {
  try {
    console.log('운동 습관 설문 데이터 시드 시작...');

    // 1. 설문지 생성
    const survey = await Survey.create({
      title: '운동 습관 설문지',
      description: '최근 운동 습관을 평가하여 맞춤형 컨설팅을 제공합니다.',
      category: 'exercise',
      version: '1.0',
      isActive: true
    });

    console.log('설문지 생성 완료:', survey._id);

    // 2. 문항 생성
    const questions = [
      {
        surveyId: survey._id,
        questionNumber: 1,
        questionText: '최근 1주일간 30분 이상 운동(걷기 포함)을 얼마나 하셨나요?',
        options: [
          { text: '전혀 하지 않았다', score: 0 },
          { text: '1~2회 정도', score: 1 },
          { text: '3~4회 정도', score: 2 },
          { text: '5회 이상', score: 3 },
          { text: '거의 매일 규칙적으로', score: 4 }
        ]
      },
      {
        surveyId: survey._id,
        questionNumber: 2,
        questionText: '한 번 운동할 때 평균 운동 시간은 얼마나 되나요?',
        options: [
          { text: '운동하지 않음', score: 0 },
          { text: '10분 미만', score: 1 },
          { text: '10~29분', score: 2 },
          { text: '30~59분', score: 3 },
          { text: '1시간 이상', score: 4 }
        ]
      },
      {
        surveyId: survey._id,
        questionNumber: 3,
        questionText: '고강도 운동(힘들다고 느끼는 수준)을 얼마나 자주 하시나요?',
        options: [
          { text: '전혀 하지 않음', score: 0 },
          { text: '한 달에 1~2회', score: 1 },
          { text: '주 1회 정도', score: 2 },
          { text: '주 2~3회', score: 3 },
          { text: '주 4회 이상', score: 4 }
        ]
      }
    ];

    await Question.insertMany(questions);
    console.log('문항 생성 완료:', questions.length, '개');

    // 3. 결과 템플릿 생성
    const results = [
      {
        surveyId: survey._id,
        minScore: 0,
        maxScore: 2,
        level: 'excellent',
        levelText: '양호 (긍정적)',
        summary: '운동 빈도와 강도가 모두 양호한 편이에요. 근력 및 지구력 유지에 도움이 되는 루틴을 가지고 있으며, 건강한 활동 습관이 잘 자리 잡혀있어요.',
        consulting: [
          '현재의 루틴을 꾸준히 유지하고, 다양한 운동 종목을 시도하며 지루함을 방지해 보세요.',
          '고강도 운동 후에는 충분한 스트레칭과 회복 시간을 갖는 게 중요해요.',
          '단백질과 수분 섭취를 꾸준히 유지해 근육 회복과 건강을 챙겨주세요.'
        ]
      },
      {
        surveyId: survey._id,
        minScore: 3,
        maxScore: 5,
        level: 'caution',
        levelText: '주의 (보통)',
        summary: '운동을 하고는 있으나, 빈도나 강도가 다소 부족한 상태예요. 체력 유지에는 무리가 없는 수준이지만, 전반적인 운동 습관을 개선할 필요가 있어요.',
        consulting: [
          '운동 루틴의 질을 향상시키는 게 좋아요. 주 3회 이상 유산소 + 근력운동을 혼합하는 것을 추천해요.',
          '한 번에 30분 이상 운동하는 습관을 만들어 보세요.',
          '엘리베이터 대신 계단을 오르거나, 가까운 거리는 빨리 걷기 등 일상 속 활동량을 늘리는 것도 효과적이에요.'
        ]
      },
      {
        surveyId: survey._id,
        minScore: 6,
        maxScore: 8,
        level: 'warning',
        levelText: '경계 (위험)',
        summary: '전반적으로 운동이 매우 부족한 상태예요. 근력과 지구력이 감소하고, 대사 건강에 대한 위험이 증가할 수 있어요.',
        consulting: [
          '규칙적인 활동 습관을 재정립하는 것이 중요해요.',
          '매일 10분 이상 걷기부터 시작하여 몸에 익숙해지도록 해보세요.',
          '맨몸 스쿼트, 플랭크 등 집에서 간단하게 할 수 있는 근력 운동을 주 2회 추가하는 것을 권장해요.',
          '식사 조절과 규칙적인 수면 패턴도 함께 병행하면 더 큰 효과를 볼 수 있어요.'
        ]
      },
      {
        surveyId: survey._id,
        minScore: 9,
        maxScore: 12,
        level: 'critical',
        levelText: '고위험 (심각)',
        summary: '운동을 거의 하지 않는 비활동성 상태가 심각한 수준이에요. 체중 증가, 혈압, 혈당 등 대사성 질환의 위험이 매우 높아요. 즉각적인 생활 습관 개선이 필요해요.',
        consulting: [
          '하루 20분 걷기부터 시작해 체력에 맞춰 운동 시간을 점진적으로 늘려가세요.',
          '운동 시간을 스마트폰 앱 등으로 기록하며 동기 부여를 얻는 것도 좋은 방법이에요.',
          '약사 등 전문가와의 상담을 통해 건강기능식품 섭취나 운동 실천 팁에 대한 안내를 받아볼 수 있어요.',
          '스트레칭, 요가 등 몸에 부담이 적은 움직임부터 시작해 보세요.'
        ]
      }
    ];

    await SurveyResult.insertMany(results);
    console.log('결과 템플릿 생성 완료:', results.length, '개');

    console.log('운동 습관 설문 데이터 시드 완료!');
    return survey._id;

  } catch (error) {
    console.error('설문 데이터 시드 중 오류 발생:', error);
    throw error;
  }
};