import Express from 'express';
import TourModel from '../models/tour.js';
import mongoose from 'mongoose';

export const createTour = async (req, res) => {
  const tour = req.body;
  const newTour = new TourModel({
    ...tour,
    author: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newTour.save();
    res.status(201).json(newTour);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getTours = async (req, res) => {
  const { page } = req.query;
  try {
    const limit = 2;
    const startIndex = (Number(page) - 1) * limit;
    const total = await TourModel.countDocuments({});
    const tours = await TourModel.find().limit(limit).skip(startIndex);
    const result = {
      total: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: tours,
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await TourModel.findById(id);
    res.status(200).json(tour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const getToursByUser = async (req, res) => {
  const { id } = req.params;
  if (false === mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: 'User does not exist' });
  }
  try {
    const userTours = await TourModel.find({ author: id });
    res.status(200).json(userTours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const deleteTour = async (req, res) => {
  const { id } = req.params;
  if (false === mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: '404, page not found' });
  }
  try {
    console.log('deleteTour', id);
    await TourModel.findByIdAndRemove(id);
    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, imageFile, tags } = req.body;
  if (false === mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: '404, page not found' });
  }
  try {
    const tour = await TourModel.findById(id);
    const updatedTour = {
      title,
      description,
      imageFile,
      tags,
      createdAt: new Date().toISOString(),
    };
    await TourModel.findByIdAndUpdate(id, updatedTour);
    res.status(200).json(updatedTour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const searchToursByQuery = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const query = new RegExp(searchQuery, 'i');
    const tours = await TourModel.find({ title: query });
    res.status(200).json(tours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const searchToursByTag = async (req, res) => {
  const { tag } = req.params;
  try {
    const tours = await TourModel.find({ tags: { $in: [tag] } });
    res.status(200).json(tours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const relatedToursByTags = async (req, res) => {
  const { tags } = req.params;
  try {
    const tours = await TourModel.find({ tags: { $in: tags.split(',') } });
    res.status(200).json(tours);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};

export const likeTour = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) {
    res.status(404).json({ message: 'page not found' });
  }

  try {
    if (id && false === mongoose.Types.ObjectId.isValid(id)) {
      res.status(404).json({ message: '404, page not found' });
    }
    const tour = await TourModel.findById(id);
    let index = -1;
    if (tour.likes) {
      index = tour.likes.findIndex((id) => id === String(req.userId));
    }

    if (index === -1) {
      tour.likes.push(req.userId);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.userId));
    }

    const updatedTour = await TourModel.findByIdAndUpdate(id, tour, {
      new: true,
    });

    res.status(200).json(updatedTour);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
