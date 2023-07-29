import { Router } from "express";
import {productController} from "../controllers/products.controller.js";
import { productValidator } from "../middlewares/product.js";

// import { uploader } from "../utils.js";

const router = Router();

//productos paginados
router.get("/", productController.getPaginatedProducts);

router.get("/:pid", productController.getProductById);

router.post("/", productValidator, productController.addProduct);

router.put("/:pid", productController.updateProduct);

router.delete("/:pid", productController.deleteProduct);

export default router;