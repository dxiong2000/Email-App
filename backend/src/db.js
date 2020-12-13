const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

/**
 * Creates email obj
 * @param {string} id
 * @param {boolean} starred
 * @param {boolean} unread
 * @param {Object} obj
 * @return {Object} email
 */
function createMailObj(id, starred, unread, obj) {
  return ({
    'id': id,
    'starred': starred,
    'unread': unread,
    'from': obj['from'],
    'to': obj['to'],
    'subject': obj['subject'],
    'sent': obj['sent'],
    'received': obj['received'],
    'content': obj['content'],
  });
};

exports.getEmailsInMailbox = async (mailbox) => {
  let str = 'SELECT id, starred, unread, mailbox, mail FROM mail';
  let query;
  if (mailbox) {
    if (mailbox === 'Starred') {
      // console.log('in db.js, starred');
      str += ` WHERE starred = TRUE`;
      query = {
        text: str,
      };
    } else {
      str += ` WHERE mailbox = $1`;
      query = {
        text: str,
        values: [mailbox],
      };
    }
  } else {
    return [];
  }
  // console.log(query);
  const {rows} = await pool.query(query);
  // console.log(rows);
  const mailArr = [];
  const arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push(createMailObj(rows[i].id, rows[i].starred, rows[i].unread,
        rows[i].mail));
  }
  mailArr.push({'mailbox': mailbox, 'mail': arr});
  return mailArr;
};

exports.getEmailsFromSearch = async (search) => {
  let str = 'SELECT id, starred, unread, mailbox, mail FROM mail';
  let query;
  if (search) {
    str += ` WHERE mail->>'content' ~* $1 OR
      mail->>'subject' ~* $1 OR mail->'from'->>'name' ~* $1`;
    query = {
      text: str,
      values: [search],
    };
  } else {
    return [];
  }
  const {rows} = await pool.query(query);
  const mailArr = [];
  const arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push(createMailObj(rows[i].id, rows[i].starred,
        rows[i].unread, rows[i].mail));
  }
  mailArr.push({'mailbox': 'Search', 'mail': arr});
  return mailArr;
};

exports.insertMail = async (body) => {
  const query = {
    text: `INSERT INTO mail(mailbox, unread, mail)
      VALUES ($1, FALSE, $2) RETURNING id`,
    values: ['Sent', body],
  };
  const {rows} = await pool.query(query);
  return rows[0].id;
};

exports.getMailboxes = async () => {
  const query = {
    text: 'SELECT DISTINCT mailbox FROM mail',
  };
  const {rows} = await pool.query(query);
  const arr = [];
  for (let i = 0; i < rows.length; i++) {
    arr.push(rows[i]['mailbox']);
  }
  return arr;
};

exports.moveEmail = async (id, mailbox) => {
  let query;
  query = {
    text: 'SELECT * FROM mail WHERE id = $1',
    values: [id],
  };
  const {rows} = await pool.query(query);
  if (rows.length === 0) {
    return 404;
  }
  const out = rows[0];
  query = {
    text: 'DELETE FROM mail WHERE id = $1',
    values: [id],
  };
  await pool.query(query);

  query = {
    text: `INSERT INTO mail(id, starred, mailbox, mail, unread)
      VALUES($1, $2, $3, $4, $5)`,
    values: [id, out['starred'], mailbox, out['mail'], out['unread']],
  };
  await pool.query(query);
  return 204;
};

exports.updateStarred = async (id) => {
  // console.log('in updateStarred:', id);
  let query;
  query = {
    text: 'SELECT starred FROM mail WHERE id = $1',
    values: [id],
  };

  const {rows} = await pool.query(query);
  const starred = !rows[0]['starred'];

  query = {
    text: 'UPDATE mail SET starred = $1 WHERE id = $2',
    values: [starred, id],
  };
  await pool.query(query);
  return 204;
};

exports.updateUnread = async (id) => {
  let query;
  query = {
    text: 'SELECT unread FROM mail WHERE id = $1',
    values: [id],
  };

  const {rows} = await pool.query(query);
  const unread = !rows[0]['unread'];
  // console.log('in updateUnread:', id, unread);

  query = {
    text: 'UPDATE mail SET unread = $1 WHERE id = $2',
    values: [unread, id],
  };
  await pool.query(query);
  return 204;
};

exports.countStarred = async () => {
  const query = {
    text: 'SELECT count(*) FROM mail WHERE starred = TRUE',
  };
  const {rows} = await pool.query(query);
  return rows[0]['count'];
};

exports.countUnread = async (mailbox) => {
  const query = {
    text: 'SELECT count(*) FROM mail WHERE mailbox = $1 AND unread = TRUE',
    values: [mailbox],
  };
  const {rows} = await pool.query(query);
  return rows[0]['count'];
};

exports.updateName = async (name) => {
  let query = {
    text: `UPDATE mail SET mail->'from'->>'name' = $1
      WHERE mail->'from'->>'email' = 'cse183student@ucsc.edu'`,
    values: [name],
  };
  await pool.query(query);
  query = {
    text: `UPDATE mail SET mail->'to'->>'name' = $1
      WHERE mail->'to'->>'email' = 'cse183student@ucsc.edu'`,
    values: [name],
  };
  await pool.query(query);
  return 204;
};
