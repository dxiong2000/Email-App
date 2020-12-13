import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';

// components
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';

// icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SaveIcon from '@material-ui/icons/Save';

// contexts
import {SettingsContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  settingsView: {
    ['@media (max-width:700px)']: {
      height: 1000,
    },
  },
  backbutton: {
  },
  toolbar: theme.mixins.toolbar,
  savebutton: {
    marginLeft: '80%',
  },
  item: {
    padding: 0,
    fontSize: 16,
  },
  initialDiv: {
    marginLeft: '5%',
    padding: theme.spacing(0, 2, 0, 0),
  },
  initial: {
    width: '60px',
    lineHeight: '60px',
    borderRadius: '100%',
    textAlign: 'center',
    border: '2px solid #c0c4c2',
    backgroundColor: '#c0c4c2',
    fontSize: 30,
    color: '#fcfcfc',
  },
}));

/**
 * Settings Component
 * @return {JSX} JSX
 */
export default function SettingsComponent() {
  const classes = useStyles();
  const [alertOpen, setAlertOpen] = useState(false);

  const handleClickOpen = () => {
    setAlertOpen(true);
  };

  const handleClose = () => {
    setAlertOpen(false);
  };

  return (
    <SettingsContext.Consumer>
      {({settingsOpen, handleSettingsToggle, handleUsernameStrChange,
        usernameStr, handleChangeNameKeyDown, username, changeNameOpen,
        changeNameAnchorEl, handleChangeNameClose, handleChangeNameClick,
        handleSaveNameUpdate, setUsername}) => {
        const initial = username[0].toUpperCase();
        const oldName = username;
        return (
          <Drawer variant='persistent' anchor='bottom' open={settingsOpen}>
            <div className={classes.settingsView}>
              <AppBar position='fixed'>
                <Toolbar>
                  <IconButton color="inherit" aria-label="back"
                    edge="start" onClick={
                      () => {
                        if (oldName === username) {
                          handleSettingsToggle();
                        } else {
                          handleClickOpen();
                        }
                        // handleSettingsToggle();
                      }}
                    className={classes.backbutton}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <IconButton color="inherit" aria-label="save"
                    edge="end" className={classes.savebutton}
                    onClick={
                      () => {
                        // handleSaveNameUpdate();
                        handleSettingsToggle();
                      }}>
                    <SaveIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Dialog open={alertOpen} onClose={handleClose}>
                <DialogTitle id="alert-dialog-title">
                  {'Save changes'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Do you want to save your changes?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={
                    () => {
                      handleClose();
                      setUsername(oldName);
                      handleSettingsToggle();
                    }}>
                    No
                  </Button>
                  <Button onClick={handleClose} color="primary" autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <div className={classes.toolbar} />
              <List>
                <ListItem>
                  <div className={classes.initialDiv}>
                    <div className={classes.initial}>
                      {initial}
                    </div>
                  </div>
                  <List>
                    <ListItem button classes={{root: classes.item}}
                      onClick={handleChangeNameClick} >
                      {username}
                    </ListItem>
                    <Popover id='popover' open={changeNameOpen}
                      anchorEl={changeNameAnchorEl}
                      onClose={handleChangeNameClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                      }} transformOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}>
                      <TextField placeholder='New Username'
                        value={usernameStr}
                        onChange={handleUsernameStrChange}
                        onKeyDown={
                          (event) => {
                            handleChangeNameKeyDown(event);
                          }} />
                    </Popover>
                    <ListItem classes={{root: classes.item}}>
                      {'cse183student@ucsc.edu'}
                    </ListItem>
                  </List>
                </ListItem>
              </List>
            </div>
          </Drawer>
        );
      }}
    </SettingsContext.Consumer>
  );
};
