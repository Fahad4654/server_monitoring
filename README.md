# server_monitoring

### Pre-requisite

    1. node version 22
    2. pm2



### Steps for Development mode:

step-1: Clone repo

```sh
git clone https://github.com/Fahad4654/server_monitoring.git
```

step-2:

```sh
cd server_monitoring
```

step-3: Dependency install

```sh
npm install
```

step-4: Create a .env file as sample.env

step-5: Start in Dev mode

```sh
npm run dev
```




### Steps for Production mode:
step-1: Clone repo

```sh
git clone https://github.com/Fahad4654/server_monitoring.git
```

step-2:

```sh
cd server_monitoring
```

step-3: Dependency install

```sh
npm install
```

step-4: Create a .env file as sample.env

step-5: Build

```sh
npm run build
```

step-6: Start using pm2

```sh
pm2 start dist/index.js --name=monitoring
```

step-6: To see log

```sh
pm2 log monitoring
```