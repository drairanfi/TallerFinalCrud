const express = require('express');
const { body, param, validationResult } = require('express-validator');
const ctrl = require('../controllers/users');

const router = express.Router();

const validate = (checks) => async (req,res,next) => {
  for (const c of checks) await c.run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', ctrl.list);
router.get('/:id', validate([param('id').isInt()]), ctrl.get);
router.post('/', validate([
  body('name').isString().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), ctrl.create);
router.put('/:id', validate([
  param('id').isInt(),
  body('name').optional().isString(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 })
]), ctrl.update);
router.delete('/:id', validate([param('id').isInt()]), ctrl.remove);

module.exports = router;
