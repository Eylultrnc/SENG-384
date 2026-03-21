FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# ŞU SATIRI MUTLAKA EKLE (Hatanın nedenini terminalde gösterecek):
RUN ls -R
EXPOSE 3000
CMD ["npm", "start"]