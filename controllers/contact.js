import QueryModel from '../models/query.js';

export const contact = async (req, res) => {
  console.log(req.body);
  const { fullName, email, message } = req.body;
  try {
    const result = await QueryModel.create({
      name: fullName,
      email,
      message,
    });

    return res.status(201).json({ result: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
