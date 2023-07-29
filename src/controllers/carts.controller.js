import {cartService} from "../services/carts.services.js";

class CartController {

    // Gets all carts
    getCarts(req, res) {
        const carts = cartService.getCarts();
        return res.send({ status: "success", payload: carts });
    }

    // Gets a cart by id
    getCartById(req, res) {
        const cartId = req.params.cid;
        const cart = cartService.getCartById(cartId);

        if (!cart) {
            return res.status(404).send({
                status: "Error",
                error: "cart was not found",
            });
        }
        return res.send({ status: "OK", message: "Cart found", payload: cart });
    }

    // Creates a cart
    addCart(req, res) {
        const cart = req.body;
        if (!cart) {
            return res
                .status(400)
                .send({ status: "Error", error: "Cart could not be added" });
        }

        const newCart = cartService.addCart(cart);
        return res.send({
            status: "OK",
            message: "Cart added successfully",
            payload: newCart,
        });
    }

    // Adds a product to a cart
    addProduct(req, res) {

        const cartId = req.params.cid

        const productId = req.params.pid

        const newProduct = cartService.addProduct(cartId, productId)

        if (!newProduct) {

            return res.status(404).send({ status: 'Error', error: 'Product could not be found' })

        }

        return res.send({

            status: 'OK',

            message: 'Product successfully added to the cart',

            payload: newProduct,

        })
    }

    // Adds multiple products to a cart
    addProducts(req, res) {
        const cartId = req.params.cid;
        const products = req.body;

        const updatedCart = cartService.addProducts(cartId, products);
        if (!updatedCart)
            return res.status(400).send({ status: "error", error: "error" });

        return res.send({ status: "sucess", message: "cart updated" });
    }

    //borrar producto del carrito
    deleteProduct(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = cartService.deleteProduct(cartId, productId);

        if (!updatedCart)
            return res
                .send(404)
                .send({ status: "error", error: "product was not found" });

        return res.send({ status: "sucess", message: "product deleted from cart" });
    }

    // Deletes all products from a cart
    deleteAllProducts(req, res) {
        const cartId = req.params.cid;

        const updatedCart = cartService.deleteAllProducts(cartId);

        if (!updatedCart)
            return res.status(404).send({ status: "error", error: "cart not found" });

        return res.send({
            status: "sucess",
            message: "deleted all products from cart",
        });
    }

    updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;

        const updatedCart = cartService.updateProductQuantity(
            cartId,
            productId,
            quantity
        );

        if (!updatedCart)
            return res.status(400).send({ status: "error", error: "error" });

        return res.send({ status: "sucess", message: "cart updated" });
    }

}

export const cartController = new CartController ();