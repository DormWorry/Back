import { Connection } from 'typeorm';
import { PersonalityType } from '../../modules/personality-type/entities/personality-type.entity';

export const seedPersonalityTypes = async (
  connection: Connection,
): Promise<void> => {
  const personalityTypeRepository = connection.getRepository(PersonalityType);

  // 기존 데이터 확인
  const existingCount = await personalityTypeRepository.count();
  if (existingCount > 0) {
    console.log('성격 유형 데이터가 이미 존재합니다. 시드 작업을 건너뜁니다.');
    return;
  }

  // 프론트엔드에서 사용하는 카드 데이터와 일치하는 성격 유형 데이터
  const personalityTypes = [
    {
      id: 1,
      typeName: '부지런한 깔끔쟁이',
      description:
        '깔끔하고 규칙적인 생활을 추구하는 타입입니다. 조용하고 정돈된 환경에서 생활하기를 선호합니다.',
    },
    {
      id: 2,
      typeName: '자유로운 밤샘러',
      description:
        '자유로운 라이프스타일을 가진 야행성 타입입니다. 룸메이트의 생활 패턴에 크게 구애받지 않습니다.',
    },
    {
      id: 3,
      typeName: '사교적인 활동러',
      description:
        '활발하고 사교적인 성격으로, 룸메이트와 함께하는 활동을 즐기는 타입입니다.',
    },
    {
      id: 4,
      typeName: '조용한 독서가',
      description:
        '조용하고 독립적인 생활을 즐기는 타입입니다. 서로의 프라이버시를 존중하는 것을 중요시합니다.',
    },
    {
      id: 5,
      typeName: '밤샘형 넷플릭스 매니아',
      description:
        '밤늦게까지 영상 시청을 즐기지만, 타인에 대한 배려도 갖춘 타입입니다.',
    },
    {
      id: 6,
      typeName: '독립적인 미니멀리스트',
      description:
        '심플하고 독립적인 라이프스타일을 추구하며, 불필요한 소통과 물건을 최소화하는 타입입니다.',
    },
    {
      id: 7,
      typeName: '게임러 야식러',
      description:
        '게임을 즐기고 야식을 좋아하지만, 타인을 배려할 줄 아는 타입입니다.',
    },
    {
      id: 8,
      typeName: '소셜 네트워커',
      description:
        '활발한 사회생활을 즐기며, 룸메이트와도 친밀한 관계를 형성하고 싶어하는 타입입니다.',
    },
    {
      id: 9,
      typeName: '집중이 필요한 공부러',
      description:
        '학업에 집중하기 위해 조용하고 정돈된 환경을 필요로 하는 타입입니다.',
    },
  ];

  // 데이터 삽입
  await personalityTypeRepository.save(personalityTypes);
  console.log('성격 유형 데이터가 성공적으로 시드되었습니다.');
};
