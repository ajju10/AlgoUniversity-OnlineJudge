FROM node:18.17.1
LABEL authors="ajay"
WORKDIR /usr/oj-frontend
COPY package.json .
COPY package-lock.json .
RUN npm install
RUN npm install serve
COPY . .
RUN npm run build
CMD ["serve", "-s", "build"]