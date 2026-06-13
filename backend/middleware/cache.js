import mcache from 'memory-cache';

export const cache = (durationMinutes) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);

    if (cachedBody) {
      // Send cached response
      res.setHeader('X-Cache', 'HIT');
      return res.json(JSON.parse(cachedBody));
    } else {
      // Overwrite res.json to cache the response before sending
      res.setHeader('X-Cache', 'MISS');
      res.sendResponse = res.json;
      res.json = (body) => {
        if (res.statusCode === 200) {
          mcache.put(key, JSON.stringify(body), durationMinutes * 60 * 1000);
        }
        res.sendResponse(body);
      };
      next();
    }
  };
};

export const clearCache = (prefix) => {
  const keys = mcache.keys();
  keys.forEach((key) => {
    if (key.startsWith('__express__' + prefix)) {
      mcache.del(key);
    }
  });
};
