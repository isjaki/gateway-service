FROM node:19

COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./

EXPOSE 8000

ENTRYPOINT [ "npm", "start" ]
