'use strict';

const isURL = require('validator/lib/isURL');

const linkdump = require('./linkdump');


module.exports = {
  links(req, res) {
    if (req.method === 'GET') {
      res.set('Access-Control-Allow-Origin', '*');

      return linkdump.getLinksPaginated({ page: req.query.page, pageSize: req.query.pageSize })
        .then(({ pages, total, links }) => res.json({ pages, total, links }))
        .catch((err) => {
          console.error(err);
          res.status(500).send(err.message);
        });
    }

    return res.sendStatus(404);
  },

  dump(req, res) {
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'POST');
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      return res.sendStatus(204);
    }

    if (req.method === 'POST') {
      res.set('Access-Control-Allow-Origin', '*');

      if (!req.body.title || !isURL(req.body.uri)) {
        return res.sendStatus(400);
      }

      return linkdump.saveLink(req.body)
        .then(() => res.sendStatus(204))
        .catch((err) => {
          console.error(err);
          res.status(500).send(err.message);
        });
    }

    return res.sendStatus(404);
  },

  // delete(req, res) {
  //   if (!req.query.id) {
  //     return res.sendStatus(400);
  //   }

  //   return linkdump.deleteLink(req.query.id)
  //     .then(result => res.json(result))
  //     .catch((err) => {
  //       console.error(err);
  //       res.status(500).send(err.message);
  //     });
  // },
};
