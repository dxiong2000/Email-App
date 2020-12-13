const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const emails = require('./emails.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.safeLoad(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
    OpenApiValidator.middleware({
      apiSpec: apiSpec,
      validateRequests: true,
      validateResponses: true,
    }),
);

// GET /v0/email?mailbox={mailbox}&from={from}
app.get('/v0/email', emails.getEmails);
// POST new email to sent
app.post('/v0/email', emails.postMail);
// GET list of mailboxes
app.get('/v0/mailboxes', emails.getMailboxes);
// PUT email specified by ID into mailbox specified by query
app.put('/v0/move/:id', emails.moveEmail);
// update starred email
app.put('/v0/emailupdate/:id', emails.emailUpdate);
// GET count of starred emails
app.get('/v0/countstarred', emails.countStarred);
// GET count of unread emails by mailbox
app.get('/v0/countunread', emails.countUnread);
// update name
app.put('/v0/updatename', emails.updateName);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
