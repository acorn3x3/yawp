const { Router } = require('express');
const { Restaurant } = require('../models/Restaurant');
const { Review } = require('../models/Review');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const data = await Restaurant.getAll();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })
  .get('/:restId', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.restId);
      await restaurant.addReviews();
      res.json(restaurant);
    } catch (e) {
      next(e);
    }
  })
  .post('/:id/reviews', authenticate, async (req, res, next) => {
    try {
      const review = await Review.insert({
        restId: req.params.id,
        userId: req.user.id,
        detail: req.body.detail,
      });
      res.json(review);
    } catch (e) {
      next(e);
    }
  });
