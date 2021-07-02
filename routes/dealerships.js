const router = require('express').Router();
const {
  getDealerships,
  createDealership,
  updateDealership,
  deleteDealership,
  getDealership
} = require('../controllers/dealerships');

router.route('/')
  .post(createDealership)
  .get(getDealerships);

router.route('/:dealershipId')
  .get(getDealership)
  .put(updateDealership)
  .delete(deleteDealership);

module.exports = router;