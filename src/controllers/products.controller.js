import productService from "../services/carts.services.js";

class ProductController {
    getPaginatedProducts() {
        const options = {
            query: {},
            pagination: {
                limit: req.query.limit ?? 10,
                page: req.query.page ?? 1,
                lean: true,
                sort: {},
            },
        };

        if (req.query.category) {
            options.query.category = req.query.category;
        }

        if (req.query.status) {
            options.query.status = req.query.status;
        }

        if (req.query.sort) {
            options.pagination.sort.price = req.query.sort;
        }

        const {
            docs: products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
        } = productService.getPaginatedProducts(options);

        const link = `/?limit=${options.pagination.limit}&page=`;
        const prevLink = hasPrevPage ? `${link}${prevPage}` : null;
        const nextLink = hasNextPage ? `${link}${nextPage}` : null;


        return res.render("home", {
            products,
            totalPages,
            page,
            hasNextPage,
            hasPrevPage,
            prevLink,
            nextLink,
            title: "Products",
        });
    }


    //producto por ID
    getProductById() {
        const productId = req.params.pid;
        const product = productService.getProductById(productId);

        if (!product) {
            return res
                .status(404)
                .send({ status: "Error", error: "product was not found" });
        }
        return res.send({
            status: "sucess",
            message: "product found",
            payload: product,
        });
    }

    //agregar producto
    addProduct() {
        const product = req.body;

        if (!product) {
            return res.status(400).send({
                status: "Error",
                error: "Error, the product could not be added",
            });
        }

        productService.addProduct(product);
        return res.send({ status: "OK", message: "Product successfully added" });
    }

    //actualizar producto

    updateProduct() {
        const productId = req.params.pid;
        const changes = req.body;

        const updatedProduct = productService.updateProduct(productId, changes);

        if (!updatedProduct) {
            return res
                .status(404)
                .send({ status: "Error", error: "product was not found" });
        }
        return res.send({
            status: "OK",
            message: "Product succesfully updated",
        });
    }

    deleteProduct() {
        const productId = req.params.pid;
        const deletedProduct = productService.deleteProduct(productId);

        if (!deletedProduct) {
            return res
                .status(404)
                .send({ status: "Error", error: "Product does not exist" });
        }
        return res.send({ status: "OK", message: "Product deleted successfully" });
    }

}

export const productController = new ProductController();