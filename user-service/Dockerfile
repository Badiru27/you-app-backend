FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install 
RUN npm install prisma

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3344

CMD ["sh", "-c", "npx prisma db push && npx prisma generate && npm run start"]