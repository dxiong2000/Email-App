const db = require('./db.js');

/**
 * Handles GET request for /v0/email?mailbox={mailbox}&from={from}
 * @param {obj} req
 * @param {obj} res
 */
exports.getEmails = async (req, res) => {
  res.set('Content-Type', 'application/json');
  let arr;
  // console.log(req.query.mailbox);
  if (req.query.mailbox) {
    arr = await db.getEmailsInMailbox(req.query.mailbox);
    if (arr.length > 0) {
      // console.log('in emails.js:', arr);
      res.status(200).send(JSON.stringify(arr));
    } else {
      res.status(200).send(JSON.stringify([]));
    }
  } else if (req.query.search) {
    arr = await db.getEmailsFromSearch(req.query.search);
    if (arr.length > 0) {
      res.status(200).send(JSON.stringify(arr));
    } else {
      res.status(200).send(JSON.stringify([]));
    }
  }
};

/**
 * handles post request for /v0/mail
 * @param {obj} req
 * @param {obj} res
 */
exports.postMail = async (req, res) => {
  res.set('Content-Type', 'application/json');
  // check if given email has id, from-email, or from-name
  if (req.body.hasOwnProperty('id') ||
      req.body.hasOwnProperty('from') ||
      req.body.hasOwnProperty('sent') ||
      req.body.hasOwnProperty('received')) {
    res.status(400).send();
  } else {
    const d = new Date();
    req.body['from'] = {};
    req.body['from']['email'] = 'cse183-student@ucsc.edu';
    req.body['from']['name'] = 'CSE183 Student';
    req.body['sent'] = d.toISOString();
    req.body['received'] = d.toISOString();

    // adds email to database
    const id = await db.insertMail(req.body);
    req.body['id'] = id;
    res.status(201).send(JSON.stringify(req.body));
  }
};

exports.getMailboxes = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const arr = await db.getMailboxes();
  res.status(200).send(JSON.stringify(arr));
};

exports.moveEmail = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const code = await db.moveEmail(req.params.id, req.query.mailbox);
  res.status(code).send();
};

exports.emailUpdate = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const id = req.params.id;
  let code;
  if (req.query.type === 'starred') {
    code = await db.updateStarred(id);
  } else {
    code = await db.updateUnread(id);
  }
  res.status(code).send();
};

exports.countStarred = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const count = await db.countStarred();
  res.status(200).send(JSON.stringify(count));
};

exports.countUnread = async (req, res) => {
  res.set('Content-Type', 'application/json');
  if (req.query.mailbox) {
    const count = await db.countUnread(req.query.mailbox);
    res.status(200).send(JSON.stringify(count));
  } else {
    res.status(404).send();
  }
};

exports.updateName = async (req, res) => {
  res.set('Content-Type', 'application/json');
  const code = await db.updateName(req.query.name);
  res.status(code).send();
};
