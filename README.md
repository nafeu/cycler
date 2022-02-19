# Cycler

...

## Requirements

...

## Development

### API Access
...

### Installation

```
git clone https://github.com/nafeu/cycler.git
cd cycler
npm install
cd client
npm install
cd ..
cp .example-env .env
```

Open the `.env` file in your text editor of choice and fill it in

### Server

```
npm run dev
```

### Client

Create a new terminal tab/session and do the following:

```
cd client
npm start
```

View development app at `http://localhost:3000`

### Testing

...

## Deployment

### Cloud (Heroku)

_* Make sure you have [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed, have created a heroku app and are logged in to the cli._

```
heroku config:set TOKEN=[enter your access token]
npm run deploy
```

### Manual Production Build

```
npm run build
npm start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
