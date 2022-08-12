FROM node:16.15.1-alpine
RUN mkdir -p /workspace

COPY .env /workspace

RUN mkdir -p /workspace/frontend
WORKDIR /workspace/frontend
COPY ./front-end /workspace/frontend
RUN npm install

RUN mkdir -p /workspace/backend
WORKDIR /workspace/backend
COPY ./back-end /workspace/backend
RUN npm install

WORKDIR /
COPY script.sh .
RUN chmod +x script.sh

CMD [ "/bin/sh" , "script.sh" ]
