import { connect } from "mongoose";
import productsModel from "../DAO/models/products.js";
import { entorno } from "../config.js";
export async function connectMongo() {
  try {
    await connect(
      entorno.MONGO_URL
    );
    console.log("plug to mongo!");

    // const created = productsModel.create({
    //   title: 'Joyeros',
    //   description: 'Joyeros para cuidar tus accesorios',
    //   code: '260',
    //   price: 50000,
    //   status: true,
    //   stock: 10,
    //   category: 'Joyeros',
    //   subCategory: 'JoyerosPequeños',
    //   thumbnails: 'https://drive.google.com/uc?export=download&id=1wvtwNXn5gvqN3nch-2WnAbcrKn4NdWu4',
    // });

  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}