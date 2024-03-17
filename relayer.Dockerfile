FROM --platform=linux/arm64 node:18

WORKDIR /app

COPY  packages/relayer/package.json  packages/relayer/package.json
COPY  packages/relayer/node_modules  packages/relayer/node_modules
COPY  packages/relayer/dist  packages/relayer/dist

CMD [ "node","--trace-warnings", "--es-module-specifier-resolution=node", "/app/packages/relayer/dist/main.js" ]

