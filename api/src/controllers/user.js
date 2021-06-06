const getUserInfo = (req, res) => {
  if (!req.user || !req.user.id) {
    res.json({ message: 'You are not authenticated' });
    return;
  }

  const { id: userId, email } = req.user;

  res.json({
    user_id: userId,
    email,
    message: 'Got successfully',
  });
};

module.exports = {
  getUserInfo,
};
