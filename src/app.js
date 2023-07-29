import express from 'express';
import mongoose from "mongoose";
import path from 'path';
import { __dirname} from './config.js';
import { connectMongo} from './utils/db.js';
import viewsRouter from '../src/routes/views.router.js';
import handlebars from 'express-handlebars';
import cartsRouter from './routes/cart.router.js';
import { loginRouter } from './routes/login.router.js';
import session from 'express-session';
import FileStore from 'session-file-store';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { iniPassport } from './utils/passport.config.js';
import {sessionGitHubRouter} from './routes/sessionGitHub.router.js';
import { UserModel } from './DAO/models/users.model.js';
import { entorno } from './config.js';

const app = express();
const port = entorno.PORT;
const fileStore = FileStore(session);

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
    store: MongoStore.create({ mongoUrl: entorno.MONGO_URL, ttl: 86400 * 7 }),
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

//TODO LO DE PASSPORT
iniPassport();
app.use(passport.initialize());
app.use(passport.session());
//FIN TODO LO DE PASSPORT

// const addCartToUser = async () => {
//   try {
//     const userId = "64ba1462b77b4203f2150a07";
//     const cartId = "6497cdf848cb396f1df1a87a";

//     // Convertir las cadenas de IDs a ObjectIDs
//     // const objectIdUserId = new mongoose.Types.ObjectId(userId);
//     // const objectIdCartId = new mongoose.Types.ObjectId(cartId);


//     // Buscar el usuario por su ID
//     let user = await UserModel.findOne({ _id: userId });

//     if (!user) {
//       console.log("Usuario no encontrado");
//       return;
//     }

//     // Agregar el carrito al usuario
//     // user.carts.push({ cart: cartId});
//     // await user.save();
    
//     user = await UserModel.findOne({ _id: userId  }).populate('carts.cart');


//     console.log(JSON.stringify(user, null, '\t'));
//   } catch (error) {
//     console.log(error);
//   }
// };

// addCartToUser();

app.use("/", viewsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/sessions', loginRouter);
app.use('/api/sessionsGit', sessionGitHubRouter);
app.use('/api/sessions/current', (req, res) => {
  return res.status(200).json({
    status: 'success',
    msg: 'datos de la session',
    payload: req.session.user || {},
  });
});

app.get('*', (req, res) => {
  return res.status(404).json({
    status: 'error',
    msg: 'no encontrado',
    data: {},
  });
});
