FROM node:18-alpine

WORKDIR /app

COPY packages/relayer/package.json package.json
COPY packages/relayer/node_modules node_modules
COPY packages/relayer/dist dist
COPY packages/relayer/src/walletbank walletbank

CMD [ "node","--trace-warnings", "--es-module-specifier-resolution=node", "/app/dist/main.js" ]
