import express from 'express';
import path from 'path';
import { __dirname} from './utils.js';
import { connectMongo} from './db.js';
import viewsRouter from '../src/routes/views.router.js';
import handlebars from 'express-handlebars';
import cartsRouter from './routes/cart.router.js';
import { loginRouter } from './routes/login.router.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const app = express();
const port = 8080;

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

connectMongo();
// connectSocket(httpServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://johanardilah:Bmth2018.@dasein.q4myj6u.mongodb.net/?retryWrites=true&w=majority', ttl: 86400 * 7 }),
    secret: 'un-re-secreto',
    resave: true,
    saveUninitialized: true,
  })
);

// //Rutas: API REST CON JSON
// app.use('/api/users', usersRouter);
// app.use('/api/pets', petsRouter);

// //Rutas: HTML RENDER SERVER SIDE
// app.use('/users', usersHtmlRouter);

// //Rutas: SOCKETS
// app.use('/test-chat', testSocketChatRouter);

//Render products

app.use("/", viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', loginRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});
