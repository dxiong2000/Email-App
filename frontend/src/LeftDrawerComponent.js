import React from 'react';
import {makeStyles, useTheme} from '@material-ui/core/styles';

// components
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

// icons
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Drafts';
import AddIcon from '@material-ui/icons/Add';
import EmailIcon from '@material-ui/icons/Email';
import SettingsIcon from '@material-ui/icons/Settings';
import StarIcon from '@material-ui/icons/Star';

// contexts
import {LeftDrawerContext} from './Contexts.js';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  count: {
    marginRight: '-60%',
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
  },
}));

/**
 * LeftDrawerComponent
 * @return {JSX} JSX
 */
export default function LeftDrawerComponent() {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <LeftDrawerContext.Consumer>
      {({handleLeftDrawerToggle, leftDrawerOpen, currentMailbox,
        setCurrentMailbox, handleEmailListUpdate, handleMailboxUpdate,
        customMailboxList, newMailboxStr, mailboxList, unreadMap,
        handleMailboxStrChange, handleNewMailboxKeyDown, handlePopupClose,
        popupOpen, popupAnchorEl, handleNewMailboxClick,
        handleSettingsToggle, countStarred, handleCountStarredUpdate}) => {
        return (
          <Drawer variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={leftDrawerOpen} onClose={handleLeftDrawerToggle}
            classes={{paper: classes.drawerPaper}}>
            <List>
              <ListItem>
                <ListItemText>
                  CSE 183 Mail
                </ListItemText>
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button key={'Inbox'} onClick={
                () => {
                  handleLeftDrawerToggle();
                  setCurrentMailbox('Inbox');
                  handleEmailListUpdate();
                }} selected={'Inbox' === currentMailbox}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={'Inbox'} className={classes.name}/>
                {(unreadMap['Inbox'] > 0) &&
                  <ListItemText primary={unreadMap['Inbox']}
                    className={classes.count}/>}
              </ListItem>
              <ListItem button key={'Sent'} onClick={
                () => {
                  handleLeftDrawerToggle();
                  setCurrentMailbox('Sent');
                  handleEmailListUpdate();
                }} selected={'Sent' === currentMailbox}>
                <ListItemIcon>
                  <SendIcon />
                </ListItemIcon>
                <ListItemText primary={'Sent'} className={classes.name}/>
                {(unreadMap['Sent'] > 0) &&
                  <ListItemText primary={unreadMap['Sent']}
                    className={classes.count}/>}
              </ListItem>
              <ListItem button key={'Drafts'} onClick={
                () => {
                  handleLeftDrawerToggle();
                  setCurrentMailbox('Drafts');
                  handleEmailListUpdate();
                }} selected={'Drafts' === currentMailbox}>
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary={'Drafts'} className={classes.name}/>
                {(unreadMap['Drafts'] > 0) &&
                  <ListItemText primary={unreadMap['Drafts']}
                    className={classes.count}/>}
              </ListItem>
              <ListItem button key={'Starred'} onClick={
                () => {
                  handleLeftDrawerToggle();
                  setCurrentMailbox('Starred');
                  handleEmailListUpdate();
                }} selected={'Starred' === currentMailbox}>
                <ListItemIcon>
                  <StarIcon />
                </ListItemIcon>
                <ListItemText primary={'Starred'} className={classes.name}/>
                {(countStarred > 0) && <ListItemText primary={countStarred}
                  className={classes.count}/>}
              </ListItem>
              <ListItem button key={'Trash'} onClick={
                () => {
                  handleLeftDrawerToggle();
                  setCurrentMailbox('Trash');
                  handleEmailListUpdate();
                }} selected={'Trash' === currentMailbox}>
                <ListItemIcon>
                  <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary={'Trash'} className={classes.name}/>
                {(unreadMap['Trash'] > 0) &&
                  <ListItemText primary={unreadMap['Trash']}
                    className={classes.count}/>}
              </ListItem>
            </List>
            {(mailboxList.length > 4) && <Divider />}
            <List>
              {mailboxList.map((text) => {
                if (text === 'Inbox' || text === 'Sent' ||
                  text === 'Drafts' || text === 'Trash') {
                  return;
                } else {
                  return (
                    <ListItem button key={text} onClick={
                      () => {
                        handleLeftDrawerToggle();
                        setCurrentMailbox(text);
                        handleEmailListUpdate();
                      }} selected={text === currentMailbox}>
                      <ListItemIcon>
                        <EmailIcon />
                      </ListItemIcon>
                      <ListItemText primary={text} className={classes.name}/>
                      {(unreadMap[text] > 0) &&
                        <ListItemText primary={unreadMap[text]}
                          className={classes.count}/>}
                    </ListItem>
                  );
                }
              })}
            </List>
            <Divider />
            <List>
              <ListItem button key={'New Mailbox'}
                onClick={handleNewMailboxClick}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary={'New Mailbox'} />
              </ListItem>
              <Popover id='popover' open={popupOpen} anchorEl={popupAnchorEl}
                onClose={handlePopupClose} anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }} transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}>
                <TextField placeholder='New Mailbox Name'
                  value={newMailboxStr}
                  onChange={handleMailboxStrChange}
                  onKeyDown={
                    (event) => {
                      handleNewMailboxKeyDown(event);
                    }} />
              </Popover>
            </List>
            <Divider />
            <List>
              <ListItem button key={'Settings'}
                onClick={
                  () => {
                    handleSettingsToggle();
                    handleLeftDrawerToggle();
                  }}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={'Settings'} />
              </ListItem>
            </List>
          </Drawer>
        );
      }}
    </LeftDrawerContext.Consumer>
  );
}
