FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install 

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["sh", "-c", "npm run start"]