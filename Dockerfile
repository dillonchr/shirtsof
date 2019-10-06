FROM mhart/alpine-node:10.7.0
WORKDIR /code/
COPY package*.json ./
RUN npm i
COPY . .
CMD ["node", "index.js"]
