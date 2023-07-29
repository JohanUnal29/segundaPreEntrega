  
export const productValidator = (req, res, next) => {
    const { title, description, code, price, status, stock, category, subCategory, thumbnails } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category || !subCategory || !thumbnails) {
        return res.status(400).json({ msg: 'error de validacion' });
    } else {
        return next();
    }
};