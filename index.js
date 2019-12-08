const fp = require("fastify-plugin");
const authHelper = require("./lib/utils/auth.helper");

// fastify-jwt auth plugin
module.exports = fp(plugin);

async function plugin(fastify, opts) {
  const cb = opts.cb;

  if (cb) {
    cb();
  }

  fastify.addHook("onRequest", async (req, res) => {
    try {
      const check = authHelper.isURLIgnored(req, opts.ignoreRoutes);

      if (check) {
        const token = authHelper.extractToken(req);

        const decoded = authHelper.verifyToken({
          token,
          secret: opts.secret
        });
        req.decoded = decoded;
      }
    } catch (error) {
      res.send(error);
    }
  });
}
