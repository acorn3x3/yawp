const { Router } = require('express');
const { Review } = require('../models/Review.js');
const authenticate = require('../middleware/authenticate.js');
const userDelete = require('../middleware/userDelete.js');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const review = await Review.getById(req.params.id);
      if (!review) {
        next();
      }
      res.json(review);
    } catch (e) {
      next(e);
    }
  })
  .delete('/:id', authenticate, userDelete, async (req, res, next) => {
    try {
      const reviewDelete = await Review.deletebyId(req.params.id);
      res.json(reviewDelete);
    } catch (e) {
      next(e);
    }
  });
