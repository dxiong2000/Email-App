import React from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';

// components
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';

// icons
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import AccountCircle from '@material-ui/icons/AccountCircle';

// contexts
import {AppBarContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  appBar: {
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
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
}));

/**
 * AppBarComponent
 * @return {JSX} JSX
 */
export default function AppBarComponent() {
  const classes = useStyles();

  return (
    <AppBarContext.Consumer>
      {({handleLeftDrawerToggle, handleComposeToggle,
        setToNameStr, setSubStr, setContentStr, setToEmailStr,
        handleSearchToggle, handleSettingsToggle,
        handleCountStarredUpdate, handleCountUnreadUpdate}) => {
        return (
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer"
                edge="start" onClick={
                  () => {
                    handleCountStarredUpdate();
                    handleCountUnreadUpdate();
                    handleLeftDrawerToggle();
                  }}
                className={classes.menuButton}>
                <MenuIcon />
              </IconButton>
              <div className={classes.search}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase placeholder="Search" value={''}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{'aria-label': 'search'}}
                  button='true' onClick={
                    () => {
                      handleSearchToggle();
                    }} />
              </div>
              <IconButton color="inherit" aria-label="compose" onClick={
                () => {
                  setToNameStr('');
                  setToEmailStr('');
                  setSubStr('');
                  setContentStr('');
                  handleComposeToggle();
                }}>
                <CreateIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="settings"
                edge='end' onClick={
                  () => {
                    handleSettingsToggle();
                  }}>
                <AccountCircle />
              </IconButton>
            </Toolbar>
          </AppBar>
        );
      }}
    </AppBarContext.Consumer>
  );
}
