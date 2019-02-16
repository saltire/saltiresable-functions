'use strict';

const squel = require('squel').useFlavour('postgres');

const db = require('./db');


module.exports = {
  getLinksPaginated(options) {
    const countQuery = squel.select()
      .from('link')
      .field('count(*)', 'total');

    const page = Number(options && options.page) || 1;
    const pageSize = Number(options && options.pageSize) || 50;

    const linkQuery = squel.select()
      .from('link')
      .field('*')
      .order('ts', false)
      .offset((page - 1) * pageSize)
      .limit(pageSize);

    return db.getPool().connect()
      .then(client => Promise.all(
        [
          client.query(countQuery.toParam()),
          client.query(linkQuery.toParam()),
        ])
        .then(([countRes, linkRes]) => {
          client.release();

          const total = Number(countRes.rows[0] && countRes.rows[0].total) || 0;

          return {
            pages: Math.ceil(total / pageSize),
            total,
            links: linkRes.rows,
          };
        })
        .catch((err) => {
          client.release();
          throw err;
        }));
  },

  saveLink(body) {
    const link = {
      uri: body.uri || '',
      title: body.title || '',
      ts: new Date().toISOString(),
      approved: false,
    };

    const query = squel.insert()
      .into('link')
      .setFields(link);

    return db.getPool().query(query.toParam());
  },

  deleteLink(id) {
    const query = squel.delete()
      .from('link')
      .where('id = ?', id);

    return db.getPool().query(query.toParam());
  },

  createTable() {
    const query = {
      text: 'CREATE TABLE IF NOT EXISTS link (' +
        'id SERIAL PRIMARY KEY, ' +
        'uri VARCHAR(255), ' +
        'title VARCHAR(255), ' +
        'ts TIMESTAMP, ' +
        'approved BOOLEAN' +
      ')',
    };

    return db.getPool().query(query.toParam());
  },

  dropTable() {
    const query = {
      text: 'DROP TABLE IF EXISTS link',
    };

    return db.getPool().query(query.toParam());
  },

  importLinks(rows) {
    const query = squel.insert()
      .into('link')
      .setFieldsRows(rows.map(row => ({
        uri: /^https?:\/\//.test(row.uri) ? row.uri : `http://${row.uri}`,
        title: row.title,
        ts: new Date(row.ts * 1000).toISOString(),
        approved: row.approved === '1',
      })));

    return db.getPool().query(query.toParam());
  },
};
