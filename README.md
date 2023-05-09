# dojo-blogs

docker-compose -f docker-compose.yml up


// start the api (backend)
cd backend
npm install
npm run dev
// start the vue app (frontend)
cd frontend/vue-project
npm install
npm run serve


Frontend Vuejs app running at:
- Local:   http://localhost:8080/
- Network: http://192.168.10.10:8080/

Requests made using Axios to.

Node JS Express backend server running at:
- http://localhost:3333/ + '/api/auth/' or '/api/posts/'

Connected to MySQL database (using Sequelize):
- port 3306

Redis session storage running at:
- http://localhost:6379/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


