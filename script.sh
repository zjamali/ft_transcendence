#!/bin/sh
cd /workspace/frontend
npm run build
(npm run start&)

cd /workspace/backend
npm run start