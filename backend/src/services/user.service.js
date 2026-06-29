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

async function connectTelegram(user, telegramChatId) {
  user.telegramChatId = telegramChatId;

  await user.save();

  return user;
}

module.exports = {
  getProfile,
  updateProfile,
  connectTelegram,
};
