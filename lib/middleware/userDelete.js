const { Review } = require('../models/Review.js');

module.exports = async (req, res, next) => {
  const review = await Review.getById(req.params.id);
  try {
    if (
      req.user &&
      (req.user.id === review.userId || req.user.email === 'admin')
    ) {
      next();
    } else {
      throw new Error('You dont have access to this page yo');
    }
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
