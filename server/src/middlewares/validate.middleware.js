const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body); // Validate and parse body
    req.body = parseBody;
    next();
  } catch (err) {
    const message = err.errors ? err.errors[0]?.message || 'Invalid input' : 'Validation error';
    res.status(400).json({ message });
  }
};

export default validate;
