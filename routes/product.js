const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/authenticator');
const upload = require('../middlewares/multer');
const productController = require('../controllers/product');

router.post('/', authenticateJWT, upload.single('productImage'), productController.create);
router.get('/', productController.readAll);
router.get('/:id', productController.readSingle)
router.get('/user', authenticateJWT, productController.readCurrentUserProduct);
router.delete('/:id', authenticateJWT, productController.delete);
router.put('/:productId', authenticateJWT, productController.update);



module.exports = router;