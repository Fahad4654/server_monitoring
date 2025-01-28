# server_monitoring
### Pre-requisite

    1. node version 22
    2. pm2

### Steps for development mode:

step-1:

```sh
git clone https://github.com/Fahad4654/server_monitoring.git
```

step-2:

```sh
cd server_monitoring
```

step-3:

```sh
npm install
```

step-4: create a .env file as sample.env

step-5: for development mode

```sh
npm run dev
```


### Steps for development mode:
step-1:

```sh
git clone https://github.com/Fahad4654/server_monitoring.git
```

step-2:

```sh
cd server_monitoring
```

step-3:

```sh
npm install
```

step-4: create a .env file as sample.env

step-5:

```sh
npm run build
```

step-6:

```sh
pm2 start dist/index.js --name=monitoring
```