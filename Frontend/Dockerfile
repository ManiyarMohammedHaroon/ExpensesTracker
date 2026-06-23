# Stage 1: Build
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Accept build argument for API URL
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build
RUN find dist -type f -name "*.js" -exec sed -i "s|http://localhost:5000||g" {} +

# Step 2: Serve with Nginx
FROM nginx:alpine
RUN apk add --no-cache gettext
COPY --from=build /app/dist /usr/share/nginx/html
ENV API_PORT=80
ENV API_BACKEND=127.0.0.1
RUN mkdir -p /etc/nginx/templates && printf 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } location /api/ { proxy_pass http://$API_BACKEND:$API_PORT; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade"; proxy_set_header Host $host; } }' > /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD envsubst '\$API_BACKEND \$API_PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'
