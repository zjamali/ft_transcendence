#!/bin/sh

cd /workspace/backend
(npm run start&)

cd /workspace/frontend
npm run build
npm run start