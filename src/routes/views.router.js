import { Router } from "express";
import ProductManager from "../DAO/dbManagers/products.js";
import CartManager from "../DAO/dbManagers/carts.js";
import {checkUser, checkAdmin} from "../middlewares/auth.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/profile", async (req, res) => {
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
  let rol = "";

  if(req.session.admin){
    rol = "admin";
  }else{
    rol = "usuario";
  }

  return res.render("home", {
    products,
    totalPages,
    page,
    hasNextPage,
    hasPrevPage,
    prevLink,
    nextLink,
    title: "Products",
    msg: req.session.firstName,
    rol: rol,
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

//LOGIN/REGISTER
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.render('error-page', { msg: 'no se pudo cerrar la session' });
    }
    return res.redirect('/login');
  });
});

router.get('/login', (req, res) => {
  res.render('login-form');
});

router.get('/register', (req, res) => {
  res.render('register-form');
});

// router.get('/profile', (req, res) => {
//   const msg = req.session.firstName; // Obtén el valor de la sesión
//   res.render('home', { msg });
// });



router.get('/solo-para-admin', (req, res) => {
  res.send('ESTO SOLO LO PUEDE VER EL ADMIN');
});

export default router;