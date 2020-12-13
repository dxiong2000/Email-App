import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

// components
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

// icons
// import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
// import AccountCircle from '@material-ui/icons/AccountCircle';

// contexts
import {MailboxContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  list: {
    width: '100%',
  },
  info: {
    width: '100%',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  title: {
    marginBottom: '-5%',
  },
  account: {
    marginLeft: '-5%',
  },
  item: {
    padding: 0,
  },
  date: {
    fontSize: 10,
  },
  starred: {
    marginRight: '-10%',
  },
  initialDiv: {
    marginLeft: '-5%',
    padding: theme.spacing(0, 2, 0, 0),
  },
  initial: {
    width: '40px',
    lineHeight: '40px',
    borderRadius: '100%',
    textAlign: 'center',
    border: '2px solid #c0c4c2',
    backgroundColor: '#c0c4c2',
    fontSize: 20,
    color: '#fcfcfc',
  },
  contentWrap: {
    fontSize: 12,
  },
}));

/**
 * Mailbox Component
 * @return {JSX} JSX
 */
export default function MailboxComponent() {
  const classes = useStyles();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  return (
    <MailboxContext.Consumer>
      {({currentMailbox, emailList, handleEmailViewToggle, setViewEmail,
        setEmailIsStarred, handleEmailStarredUpdate,
        handleEmailUnreadUpdate}) => {
        emailList.sort((a, b) => new Date(b.received) - new Date(a.received));
        return (
          <div className={classes.content}>
            <div className={classes.toolbar} />
            <Typography className={classes.title} variant='h6'>
              {currentMailbox}
            </Typography>
            <List className={classes.list}>
              {emailList.map((email) => {
                const date = new Date(email.received);
                let dateText = '';
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const beforeYesterday = new Date();
                beforeYesterday.setDate(beforeYesterday.getDate() - 2);
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                if (date > yesterday) {
                  dateText = date.toTimeString().substring(0, 5);
                } else if (date > beforeYesterday) {
                  dateText = 'Yesterday';
                } else if (date > oneYearAgo) {
                  dateText = months[date.getMonth()] + ' ' + date.getDate();
                } else {
                  dateText = date.getFullYear().toString();
                }
                let subjText;
                if (email.subject.length > 25) {
                  if (email.unread) {
                    subjText = email.subject.substring(0, 25) + '...';
                  } else {
                    subjText = email.subject.substring(0, 30) + '...';
                  }
                } else {
                  subjText = email.subject;
                }
                let contentText;
                if (email.content.length > 25) {
                  contentText = email.content.substring(0, 30) + '...';
                } else {
                  contentText = email.content;
                }
                if (currentMailbox === 'Sent') {
                  const initial = email.to.name.charAt(0).toUpperCase();
                  return (
                    <ListItem button key={email.id}
                      onClick={
                        () => {
                          setViewEmail(email);
                          setEmailIsStarred(email.starred);
                          // handleEmailUnreadUpdate();
                          handleEmailViewToggle();
                        }}>
                      <div className={classes.initialDiv}>
                        <div className={classes.initial}>
                          {initial}
                        </div>
                      </div>
                      <div className={classes.info}>
                        <List>
                          <ListItem classes={{root: classes.item}}>
                            <Typography style={email.unread ?
                              {flex: 1, fontWeight: 'bold'} : {flex: 1}}>
                              {email.to.name}
                            </Typography>
                            <div className={classes.date}>
                              {dateText}
                            </div>
                          </ListItem>
                          <ListItem classes={{root: classes.item}}>
                            <div style={email.unread ?
                              {flex: 1, fontWeight: 'bold'} : {flex: 1}}>
                              {subjText}
                            </div>
                            <div className={classes.starred}>
                              <ListItemIcon>
                                <StarIcon button='true'
                                  color={email.starred === true ?
                                    'secondary' : 'disabled'}/>
                              </ListItemIcon>
                            </div>
                          </ListItem>
                          <ListItem classes={{root: classes.item}}>
                            <div className={classes.contentWrap}>
                              {contentText}
                            </div>
                          </ListItem>
                        </List>
                      </div>
                    </ListItem>
                  );
                } else {
                  const initial = email.from.name.charAt(0).toUpperCase();
                  return (
                    <ListItem button key={email.id}
                      onClick={
                        () => {
                          setViewEmail(email);
                          setEmailIsStarred(email.starred);
                          // handleEmailUnreadUpdate();
                          handleEmailViewToggle();
                        }}>
                      <div className={classes.initialDiv}>
                        <div className={classes.initial}>
                          {initial}
                        </div>
                      </div>
                      <div className={classes.info}>
                        <List>
                          <ListItem classes={{root: classes.item}}>
                            <Typography style={email.unread ?
                              {flex: 1, fontWeight: 'bold'} : {flex: 1}}>
                              {email.from.name}
                            </Typography>
                            <div className={classes.date}>
                              {dateText}
                            </div>
                          </ListItem>
                          <ListItem classes={{root: classes.item}}>
                            <div style={email.unread ?
                              {flex: 1, fontWeight: 'bold'} : {flex: 1}}>
                              {subjText}
                            </div>
                            <div button='true' className={classes.starred}
                              onClick={
                                () => {
                                  handleEmailStarredUpdate();
                                }}
                              onMouseDown={
                                (event) => {
                                  event.stopPropagation();
                                  handleEmailViewToggle();
                                }}>
                              <ListItemIcon>
                                <StarIcon button='true'
                                  color={email.starred === true ?
                                    'secondary' : 'disabled'} />
                              </ListItemIcon>
                            </div>
                          </ListItem>
                          <ListItem classes={{root: classes.item}}>
                            <div className={classes.contentWrap}>
                              {contentText}
                            </div>
                          </ListItem>
                        </List>
                      </div>
                    </ListItem>
                  );
                }
              })}
            </List>
          </div>
        );
      }}
    </MailboxContext.Consumer>
  );
}
