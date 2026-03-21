FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# React varsayılan olarak 3000'de çalışır ama biz backend ile çakışmasın diye 
# Docker Compose'da bunu 3001'e eşleyeceğiz.
EXPOSE 3001
CMD ["npm", "start"]