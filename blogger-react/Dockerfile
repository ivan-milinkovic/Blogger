FROM node AS build
WORKDIR /blogger-react-src
COPY . .
RUN npm install
RUN npm run build

FROM nginx
COPY --from=build /blogger-react-src/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/
