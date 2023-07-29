import { Router } from "express";
import {cartController} from "../controllers/carts.controller.js";

const router = Router();

// Gets all carts
router.get("/", cartController.getCarts);

// Gets a cart by id
router.get("/:cid", cartController.getCartById);

// Creates a cart
router.post("/", cartController.addCart);

// Adds a product to a cart
router.post('/:cid/product/:pid', cartController.addProduct);


// Adds multiple products to a cart
router.post("/:cid", cartController.addProducts);


// Deletes an specific product from a cart
router.delete("/:cid/product/:pid", cartController.deleteProduct);

// Deletes all products from a cart
router.delete("/:cid", cartController.deleteAllProducts);

// Updates a product's quantity inside a cart
router.put("/:cid/product/:pid", cartController.updateProductQuantity);

export default router;
