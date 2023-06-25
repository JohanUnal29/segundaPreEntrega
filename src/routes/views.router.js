import { Router } from "express";
import ProductManager from "../DAO/dbManagers/products.js";
import CartManager from "../DAO/dbManagers/carts.js";


const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
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
  } = await productManager.getPaginatedProducts(options);

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
});

router.get("/product/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await productManager.getProductById(productId);
  res.render("product", { title: "Product Details", product });
});

router.get("/cart", async (req, res) => {
  const cart = await cartManager.getCartById("6497cdf848cb396f1df1a87a");
  res.render("cart", { products: cart.products, title: "Cart Items" });
});

export default router;