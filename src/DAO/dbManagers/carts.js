import cartsModel from "../models/carts.js";
import { UserModel } from "../models/users.model.js";

export default class CartManager {
  constructor() { }

  getCarts = async () => {
    try {
      const carts = await cartsModel.find();
      return carts;
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartsModel
        .findOne({ _id: id })
        .populate("products.product")
        .lean();
      return cart;
    } catch (error) {
      console.log(error);
    }
  };

  addCart = async (cart) => {
    try {
      const createdCart = cartsModel.create(cart);
      return createdCart;
    } catch (error) {
      console.log(error);
    }
  };

  addCartToUser = async () => {
    try {
      const userId = "4ba1462b77b4203f2150a07";
      const cartId = "64b6264c445e8a901e5f9611";
  
      // Convertir las cadenas de IDs a ObjectIDs
      const objectIdUserId = mongoose.Types.ObjectId(userId);
      const objectIdCartId = mongoose.Types.ObjectId(cartId);
  
      // Buscar el usuario por su ID
      let user = await UserModel.findOne({ _id: objectIdUserId });
  
      if (!user) {
        console.log("Usuario no encontrado");
        return;
      }
  
      // Agregar el carrito al usuario
      user.carts.push({ cart: objectIdCartId });
      
  
      // Volver a buscar el usuario con el carrito poblado
      // user = await UserModel.findOne({ _id: objectIdUserId }).populate('carts.cart');
  
      // console.log(JSON.stringify(user, null, '\t'));
    } catch (error) {
      console.log(error);
    }
  };
  
  addProduct = async (cartId, productId) => {
    try {
      const productExist = await cartsModel.findOne({
        "products.product": productId,
      });

      if (!productExist) {
        const updatedCart = await cartsModel.updateOne(
          { _id: cartId },
          { $push: { products: { product: productId } } }
        );
        return updatedCart;
      }

      const updatedCart = await cartsModel.updateOne(
        { _id: cartId, "products.product": productId },
        { $inc: { "products.$.quantity": 1 } }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };


  addProducts = async (cartId, products) => {
    try {
      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        { $set: { products } }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  deleteProduct = async (cartId, productId) => {
    try {
      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        { $pull: { products: { product: productId } } }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  deleteAllProducts = async (cartId) => {
    try {
      const updatedCart = await cartsModel.updateMany(
        { _id: cartId },
        { $set: { products: [] } },
        { multi: true }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };

  updateProductQuantity = async (cartId, productId, quantity) => {
    try {
      const updatedCart = await cartsModel.updateOne(
        { _id: cartId },
        { $set: { "products.$[elem].quantity": quantity } },
        { arrayFilters: [{ "elem.product": productId }] }
      );
      return updatedCart;
    } catch (error) {
      console.log(error);
    }
  };
}