FROM node:18.17.1
LABEL authors="ajay"
WORKDIR /usr/oj-backend
ENV NODE_ENV production
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 8000
CMD ["node", "index.js"]
