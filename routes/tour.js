import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.js';

import {
  createTour,
  deleteTour,
  getTour,
  getTours,
  getToursByUser,
  searchToursByQuery,
  searchToursByTag,
  relatedToursByTags,
  updateTour,
  likeTour,
} from '../controllers/tour.js';

router.post('/', auth, createTour);
router.get('/', getTours);
router.get('/searchTours', searchToursByQuery);
router.get('/searchToursByTag/:tag', searchToursByTag);
router.get('/relatedToursByTags/:tags', relatedToursByTags);
router.get('/:id', getTour);
router.get('/userTours/:id', auth, getToursByUser);

router.delete('/deleteTour/:id', auth, deleteTour);
router.patch('/updateTour/:id', auth, updateTour);
router.patch('/like/:id', auth, likeTour);

export default router;
