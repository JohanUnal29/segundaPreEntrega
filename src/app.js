import express from 'express';
import path from 'path';
import { __dirname} from './utils.js';
import { connectMongo} from './db.js';
import viewsRouter from '../src/routes/views.router.js';
import handlebars from 'express-handlebars';


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

// //Rutas: API REST CON JSON
// app.use('/api/users', usersRouter);
// app.use('/api/pets', petsRouter);

// //Rutas: HTML RENDER SERVER SIDE
// app.use('/users', usersHtmlRouter);

// //Rutas: SOCKETS
// app.use('/test-chat', testSocketChatRouter);

//Render products
app.use("/", viewsRouter);

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});
