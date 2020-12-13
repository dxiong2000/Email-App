import React from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';

// components
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

// icons
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import StarIcon from '@material-ui/icons/Star';

// contexts
import {SearchContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  searchView: {
    ['@media (max-width:700px)']: {
      height: 1000,
    },
  },
  search: {
    'flex': 1,
    'position': 'relative',
    'borderRadius': theme.shape.borderRadius,
    'marginRight': theme.spacing(2),
    'marginLeft': 0,
    'width': 'auto',
    'backgroundColor': fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  backbutton: {
  },
  clearbutton: {
  },
  toolbar: theme.mixins.toolbar,
  list: {
    width: '100%',
  },
  info: {
    width: '100%',
  },
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
    marginLeft: 0,
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
 * Search component
 * @return {JSX} JSX
 */
export default function SearchCompoment() {
  const classes = useStyles();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  return (
    <SearchContext.Consumer>
      {({searchOpen, handleSearchToggle, searchStr, handleSearchChange,
        setSearchStr, handleCallSearchUpdate, searchList, setViewEmail,
        handleEmailViewToggle, setSearchList}) => {
        return (
          <Drawer variant='persistent' anchor='bottom' open={searchOpen}
            transitionDuration={0}>
            <div className={classes.searchView}>
              <AppBar position='fixed'>
                <Toolbar>
                  <IconButton color="inherit" aria-label="back"
                    edge="start" onClick={
                      () => {
                        handleSearchToggle();
                        setSearchStr('');
                        setSearchList([]);
                      }}
                    className={classes.backbutton}>
                    <ArrowBackIosIcon />
                  </IconButton>
                  <div className={classes.search}>
                    <div className={classes.searchIcon}>
                      <SearchIcon />
                    </div>
                    <InputBase placeholder="Search"
                      classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                      }}
                      inputProps={{'aria-label': 'search'}}
                      value={searchStr} onChange={
                        (event) => {
                          handleSearchChange(event);
                          handleCallSearchUpdate();
                        }
                      }/>
                  </div>
                  <IconButton color="inherit" aria-label="back"
                    edge="end" className={classes.clearbutton}
                    onClick={
                      () => {
                        setSearchStr('');
                        setSearchList([]);
                      }
                    }>
                    <ClearIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <div className={classes.toolbar} />
              <List className={classes.list}>
                {searchList.map((email) => {
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
                    subjText = email.subject.substring(0, 30) + '...';
                  } else {
                    subjText = email.subject;
                  }
                  let contentText;
                  if (email.content.length > 25) {
                    contentText = email.content.substring(0, 30) + '...';
                  } else {
                    contentText = email.content;
                  }
                  const initial = email.from.name.charAt(0).toUpperCase();
                  return (
                    <ListItem button key={email.id}
                      onClick={
                        () => {
                          setViewEmail(email);
                          handleEmailViewToggle();
                          handleSearchToggle();
                          setSearchStr('');
                          setSearchList([]);
                        }}>
                      <div className={classes.initialDiv}>
                        <div className={classes.initial}>
                          {initial}
                        </div>
                      </div>
                      <div className={classes.info}>
                        <List>
                          <ListItem classes={{root: classes.item}}>
                            <Typography style={{flex: 1}}>
                              {email.from.name}
                            </Typography>
                            <div className={classes.date}>
                              {dateText}
                            </div>
                          </ListItem>
                          <ListItem classes={{root: classes.item}}>
                            <div style={{flex: 1}}>
                              {subjText}
                            </div>
                            <div className={classes.starred}>
                              <ListItemIcon>
                                <StarIcon button='true' color={
                                  email.starred === true ?
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
                })}
              </List>
            </div>
          </Drawer>
        );
      }}
    </SearchContext.Consumer>
  );
}
