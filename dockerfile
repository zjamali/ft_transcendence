FROM node:16.15.1-alpine
RUN mkdir -p /workspace

RUN mkdir -p /workspace/frontend
WORKDIR /workspace/frontend
COPY ./front-end/package.json /workspace/frontend
COPY ./front-end/package-lock.json /workspace/frontend
RUN npm install
COPY ./front-end /workspace/frontend

RUN mkdir -p /workspace/backend
WORKDIR /workspace/backend
COPY ./back-end/package.json /workspace/backend
COPY ./back-end/package-lock.json /workspace/backend
RUN npm install
COPY ./back-end /workspace/backend

WORKDIR /
COPY script.sh .
RUN chmod +x script.sh

# WORKDIR /workspace/frontend
CMD [ "/bin/sh" , "script.sh" ]
# CMD [ "npm", "run", "dev" ]