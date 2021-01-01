FROM node:12-slim

WORKDIR /usr/src/perfception

RUN apt-get update && apt-get install -y \
  jq
  
# Install dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm ci --only=production

# Bundle source
COPY . .