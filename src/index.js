'use strict';

const { isURL } = require('validator');

const linkdump = require('./linkdump');


module.exports = {
  links(req, res) {
    if (req.method !== 'GET') {
      return res.sendStatus(404);
    }

    return linkdump.getLinksPaginated({ page: req.query.page, pageSize: req.query.pageSize })
      .then(({ pages, total, links }) => res.json({ pages, total, links }))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message);
      });
  },

  dump(req, res) {
    if (req.method !== 'POST') {
      return res.sendStatus(404);
    }
    if (!req.body.title || req.body.title === 'site name' || req.body.name ||
      !isURL(req.body.uri)) {
      return res.sendStatus(400);
    }

    return linkdump.saveLink(req.body)
      .then(() => res.sendStatus(200))
      .catch((err) => {
        console.error(err);
        res.status(500).send(err.message);
      });
  },
};
