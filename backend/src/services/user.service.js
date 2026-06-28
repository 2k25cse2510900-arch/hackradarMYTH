async function getProfile(user) {
  return user.profile;
}

async function updateProfile(user, profile) {
  user.profile = {
    ...user.profile?.toObject?.(),
    ...profile,
  };
  await user.save();
  return user.profile;
}

module.exports = {
  getProfile,
  updateProfile,
};
