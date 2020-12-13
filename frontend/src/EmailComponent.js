import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

// components
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EmailIcon from '@material-ui/icons/Email';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
// import AccountCircle from '@material-ui/icons/AccountCircle';
import ReplyIcon from '@material-ui/icons/Reply';

// contexts
import {EmailContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  emailView: {
    ['@media (max-width:700px)']: {
      height: 1000,
    },
  },
  backbutton: {
  },
  mark: {
    marginLeft: '45%',
  },
  moveto: {
  },
  toolbar: theme.mixins.toolbar,
  deletebutton: {
    alignItems: 'left',
  },
  emailContainer: {
    padding: theme.spacing(1),
  },
  star: {
    marginLeft: '65%',
  },
  account: {
    marginRight: '-5%',
  },
  item: {
    padding: 0,
  },
  reply: {
    marginLeft: '-5%',
  },
  initialDiv: {
    marginLeft: '0',
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
}));

/**
 * Email component
 * @return {JSX} JSX
 */
export default function EmailComponent() {
  const classes = useStyles();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMoveToClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <EmailContext.Consumer>
      {({viewEmail, handleEmailViewToggle, emailOpen, currentMailbox,
        handleComposeToggle, setToNameStr, setSubStr, setContentStr,
        setToEmailStr, mailboxList, setMoveToMailbox, handleMoveUpdate,
        setCurrentMailbox, handleEmailListUpdate, emailIsStarred,
        setEmailIsStarred, handleEmailStarredUpdate,
        handleEmailUnreadUpdate}) => {
        const date = new Date(viewEmail.received);
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
        let initial;
        let name;
        let email;
        if (currentMailbox === 'Sent') {
          initial = viewEmail.to.name.charAt(0).toUpperCase();
          name = viewEmail.to.name;
          email = viewEmail.to.email;
        } else {
          initial = viewEmail.from.name.charAt(0).toUpperCase();
          name = viewEmail.from.name;
          email = viewEmail.from.email;
        }
        return (
          <Drawer variant='persistent' anchor='bottom' open={emailOpen}>
            <div className={classes.emailView}>
              <AppBar position='fixed'>
                <Toolbar>
                  <IconButton color="inherit" aria-label="back"
                    edge="start" onClick={
                      () => {
                        if (viewEmail.unread) {
                          handleEmailUnreadUpdate();
                        }
                        handleEmailListUpdate();
                        handleEmailViewToggle();
                      }} className={classes.backbutton}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton color="inherit" aria-label="mark"
                    className={classes.mark} onClick={
                      () => {
                        if (!viewEmail.unread) {
                          handleEmailUnreadUpdate();
                        }
                        handleEmailViewToggle();
                      }}>
                    <EmailIcon />
                  </IconButton>
                  <IconButton color="inherit" aria-label="move-to"
                    className={classes.moveto} onClick={
                      (event) => {
                        if (viewEmail.unread) {
                          handleEmailUnreadUpdate();
                        }
                        handleMoveToClick(event);
                      }}>
                    <MoveToInboxIcon />
                  </IconButton>
                  <Menu id="mailbox-menu" anchorEl={anchorEl} keepMounted
                    open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {mailboxList.map((mailbox) => {
                      if (mailbox === currentMailbox) {
                        return;
                      }
                      return (
                        <MenuItem key={mailbox} onClick={
                          () => {
                            setMoveToMailbox(mailbox);
                            handleMoveUpdate();
                            setCurrentMailbox(mailbox);
                            handleEmailListUpdate();
                            handleMenuClose();
                          }}>
                          {mailbox}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                  <IconButton color="inherit" aria-label="delete"
                    edge="end" className={classes.deletebutton}
                    onClick={
                      () => {
                        if (viewEmail.unread) {
                          console.log('yes');
                          handleEmailUnreadUpdate();
                        }
                        handleEmailListUpdate();
                        setMoveToMailbox('Trash');
                        handleMoveUpdate();
                        handleEmailViewToggle();
                      }}>
                    <DeleteIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <div className={classes.toolbar} />
              <div className={classes.emailContainer}>
                <List>
                  <ListItem>
                    <Typography variant='h6'>
                      {viewEmail.subject}
                    </Typography>
                  </ListItem>
                  <ListItem>
                    <Typography>
                      {currentMailbox}
                    </Typography>
                    <ListItemIcon button='true' className={classes.star}
                      onClick={
                        () => {
                          setEmailIsStarred(!emailIsStarred);
                          handleEmailStarredUpdate();
                        }}>
                      <StarIcon color={emailIsStarred === true ?
                        'secondary' : 'disabled'} />
                    </ListItemIcon>
                    <ListItemIcon button='true' className={classes.reply}
                      onClick={
                        () => {
                          if (currentMailbox === 'Sent') {
                            setToEmailStr(viewEmail.to.email);
                            setToNameStr(viewEmail.to.name);
                          } else {
                            setToEmailStr(viewEmail.from.email);
                            setToNameStr(viewEmail.from.name);
                          }
                          setSubStr('Re: ' + viewEmail.subject);
                          setContentStr('');
                          handleComposeToggle();
                        }
                      }>
                      <ReplyIcon/>
                    </ListItemIcon>
                  </ListItem>
                  <ListItem>
                    <div className={classes.initialDiv}>
                      <div className={classes.initial}>
                        {initial}
                      </div>
                    </div>
                    <List>
                      <ListItem classes={{root: classes.item}}>
                        {name + ', ' + dateText}
                      </ListItem>
                      <ListItem classes={{root: classes.item}}>
                        {email}
                      </ListItem>
                    </List>
                  </ListItem>
                </List>
                <Typography>
                  {viewEmail.content}
                </Typography>
              </div>
            </div>
          </Drawer>
        );
      }}
    </EmailContext.Consumer>
  );
}
