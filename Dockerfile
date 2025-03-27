FROM node:18-alpine

WORKDIR /usr/src/app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 빌드
RUN npm run build

EXPOSE 3001

# 프로덕션 모드로 실행
CMD ["npm", "run", "start:prod"]
