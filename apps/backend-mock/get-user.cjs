module.exports = {
  key: `get-user`,
  main() {
    return {
      useCreated(app) {
        app.use((req, res, next) => {
          try {
            const token = req.get(`Authorization`);
            const username = Buffer.from(token, 'base64').toString('utf8');
            req.username = username;
          } catch {
            // ...
          }
          next();
        });
      },
    };
  },
};
