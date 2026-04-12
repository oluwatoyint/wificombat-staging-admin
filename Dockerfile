FROM node:18-slim AS builder

WORKDIR /app

COPY package.json .

RUN npm i -f

COPY . .

ENV BASE_URL="https://backend.wificombatelearn.com"
ENV NEXT_PUBLIC_BASE_URL="https://backend.wificombatelearn.com"
ENV NEXT_PUBLIC_BASE_URL_1="https://backend.wificombatelearn.com"
ENV NEXT_PUBLIC_BASE_URL_2="https://backend.wificombatelearn.com"
ENV NEXT_PUBLIC_BASE_URL_3="https://backend.wificombatelearn.com"
ENV NEXT_PUBLIC_BASE_URL_4="https://backend.wificombatelearn.com"

RUN npm run build

EXPOSE 3000

CMD npm start