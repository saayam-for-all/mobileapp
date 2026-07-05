module.exports = {
  fetchAuthSession: jest.fn().mockResolvedValue({
    tokens: {
      accessToken: {
        toString: () => 'fake-token',
      },
    },
  }),
};