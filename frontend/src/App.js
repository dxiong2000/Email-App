import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// components
import AppBarComponent from './AppBarComponent.js';
import LeftDrawerComponent from './LeftDrawerComponent.js';
import MailboxComponent from './MailboxComponent.js';
import EmailComponent from './EmailComponent.js';
import ComposeComponent from './ComposeComponent.js';
import SearchComponent from './SearchComponent.js';
import SettingsComponent from './SettingsComponent.js';

// contexts
import {AppBarContext, LeftDrawerContext, MailboxContext,
  ComposeContext, EmailContext, SearchContext,
  SettingsContext} from './Contexts.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 * App component
 * @return {object} JSX
 */
export default function App() {
  const classes = useStyles();
  // const theme = useTheme();

  const path = 'http://localhost:3010';
  const tempEmail = {
    'id': 'temp',
    'from': {
      'name': 'temp name',
      'email': 'temp email',
    },
    'to': {
      'name': 'temp name',
      'email': 'temp email',
    },
    'received': 'temp time',
    'sent': 'temp time',
    'content': 'temp',
    'subject': 'temp',
  };

  // view open/close
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [popupAnchorEl, setPopupAnchorEl] = useState(null);
  const popupOpen = Boolean(popupAnchorEl);
  const [changeNameAnchorEl, setChangeNameAnchorEl] = useState(null);
  const changeNameOpen = Boolean(changeNameAnchorEl);

  // states
  const [currentMailbox, setCurrentMailbox] = useState('Inbox');
  const [moveToMailbox, setMoveToMailbox] = useState('');
  const [mailboxList, setMailboxList] = useState([]);
  const [emailList, setEmailList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [viewEmail, setViewEmail] = useState(tempEmail);
  const [toNameStr, setToNameStr] = useState('');
  const [toEmailStr, setToEmailStr] = useState('');
  const [subStr, setSubStr] = useState('');
  const [contentStr, setContentStr] = useState('');
  const [searchStr, setSearchStr] = useState('');
  const [newMailboxStr, setNewMailboxStr] = useState('');
  const [customMailboxList, setCustomMailboxList] = useState([]);
  const [emailIsStarred, setEmailIsStarred] = useState(null);
  const [usernameStr, setUsernameStr] = useState('');
  const [username, setUsername] = useState('CSE183 Student');
  const [countStarred, setCountStarred] = useState(0);
  const [unreadMap, setUnreadMap] = useState({});

  // useEffect triggers
  const [callEmailListUpdate, setCallEmailListUpdate] = useState(false);
  const [callSendUpdate, setCallSendUpdate] = useState(false);
  const [callSearchUpdate, setCallSearchUpdate] = useState(false);
  const [callMailboxUpdate, setCallMailboxUpdate] = useState(false);
  const [callMoveUpdate, setCallMoveUpdate] = useState(false);
  const [callEmailStarredUpdate, setCallEmailStarredUpdate] = useState(false);
  const [callEmailUnreadUpdate, setCallEmailUnreadUpdate] = useState(false);
  const [callCountStarredUpdate, setCallCountStarredUpdate] = useState(false);
  const [callCountUnreadUpdate, setCallCountUnreadUpdate] = useState(false);
  const [callSaveNameUpdate, setCallSaveNameUpdate] = useState(false);

  // useEffects

  // get list of emails for current mailbox
  useEffect(() => {
    updateEmailList();
    // console.log(currentMailbox, emailList);
  }, [callEmailListUpdate]);

  // add composed email to sent mailbox
  useEffect(() => {
    if (toEmailStr === '') {
      return;
    }
    postComposedMailToSent();
    // console.log('POST new email:', toEmailStr);
  }, [callSendUpdate]);

  // get list of emails from search query
  useEffect(() => {
    if (searchStr === '') {
      setSearchList([]);
      return;
    }
    getSearchedEmails();
    // console.log('Searched emails:', searchList);
  }, [callSearchUpdate]);

  // get names of mailboxes for 'move-to' dropdown menu
  useEffect(() => {
    getMailboxList();
    // console.log('Get mailbox list:', mailboxList);
  }, [callMailboxUpdate]);

  // update starred attribute of viewEmail
  useEffect(() => {
    if (viewEmail.id === 'temp') {
      return;
    }
    updateStarredEmail();
    // console.log('Update starred email');
  }, [callEmailStarredUpdate]);

  // update unread attribute of viewEmail
  useEffect(() => {
    if (viewEmail.id === 'temp') {
      return;
    }
    updateUnreadEmail();
    // console.log('Update unread email');
  }, [callEmailUnreadUpdate]);

  // move email to mailbox
  useEffect(() => {
    if (moveToMailbox === '' || viewEmail === tempEmail) {
      return;
    }
    putEmail();
    // console.log('Moved email');
  }, [callMoveUpdate]);

  // count starred
  useEffect(() => {
    getCountStarred();
    // console.log('Count starred:', countStarred);
  }, [callCountStarredUpdate]);

  //  count unread
  useEffect(() => {
    getCountUnread();
    // console.log('Count unread:', unreadMap);
  }, [callCountUnreadUpdate]);

  // update name
  useEffect(() => {
    if (username === 'CSE183 Student') {
      return;
    }
    updateName();
  }, [callSaveNameUpdate]);

  // handle useEffect triggers
  const handleEmailListUpdate = () => {
    setCallEmailListUpdate(!callEmailListUpdate);
  };

  const handleCallSendUpdate = () => {
    setCallSendUpdate(!callSendUpdate);
  };

  const handleCallSearchUpdate = () => {
    setCallSearchUpdate(!callSearchUpdate);
  };

  const handleMailboxUpdate = () => {
    setCallMailboxUpdate(!callMailboxUpdate);
  };

  const handleMoveUpdate = () => {
    setCallMoveUpdate(!callMoveUpdate);
  };

  const handleEmailStarredUpdate = () => {
    setCallEmailStarredUpdate(!callEmailStarredUpdate);
  };

  const handleEmailUnreadUpdate = () => {
    setCallEmailUnreadUpdate(!callEmailUnreadUpdate);
  };

  const handleCountStarredUpdate = () => {
    setCallCountStarredUpdate(!callCountStarredUpdate);
  };

  const handleCountUnreadUpdate = () => {
    setCallCountUnreadUpdate(!callCountUnreadUpdate);
  };

  const handleSaveNameUpdate = () => {
    setCallSaveNameUpdate(!callSaveNameUpdate);
  };

  // handle view toggle
  const handleLeftDrawerToggle = () => {
    setLeftDrawerOpen(!leftDrawerOpen);
  };

  const handleEmailViewToggle = () => {
    setEmailOpen(!emailOpen);
  };

  const handleComposeToggle = () => {
    setComposeOpen(!composeOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSettingsToggle = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleNewMailboxClick = (event) => {
    setPopupAnchorEl(event.currentTarget);
  };

  const handlePopupClose = (event) => {
    setPopupAnchorEl(null);
  };

  const handleChangeNameClick = (event) => {
    setChangeNameAnchorEl(event.currentTarget);
  };

  const handleChangeNameClose = (event) => {
    setChangeNameAnchorEl(null);
  };

  // handle state change
  const handleToNameChange = (event) => {
    setToNameStr(event.target.value);
  };

  const handleToEmailChange = (event) => {
    setToEmailStr(event.target.value);
  };

  const handleSubChange = (event) => {
    setSubStr(event.target.value);
  };

  const handleContentChange = (event) => {
    setContentStr(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchStr(event.target.value);
  };

  const handleMailboxStrChange = (event) => {
    setNewMailboxStr(event.target.value);
  };

  const handleUsernameStrChange = (event) => {
    setUsernameStr(event.target.value);
  };

  const handleNewMailboxKeyDown = (event) => {
    if (event.keyCode === 13) {
      for (let i = 0; i < mailboxList.length; i++) {
        if (mailboxList[i].toLowerCase() === newMailboxStr.toLowerCase()) {
          alert('Mailbox name already in use!');
          return;
        }
      }
      setCustomMailboxList(customMailboxList.concat([newMailboxStr]));
      handleMailboxUpdate();
      setPopupAnchorEl(null);
      setNewMailboxStr('');
    }
  };

  const handleChangeNameKeyDown = (event) => {
    if (event.keyCode === 13) {
      setUsername(usernameStr);
      setPopupAnchorEl(null);
      setUsernameStr('');
      handleChangeNameClose();
    }
  };

  // api calls
  const updateEmailList = async () => {
    await fetch(path + '/v0/email?mailbox=' + currentMailbox, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          if (json.length > 0) {
            setEmailList(json[0]['mail']);
          } else {
            setEmailList([]);
          }
        });
  };

  const postComposedMailToSent = async () => {
    const data = {
      'to': {
        'name': toNameStr,
        'email': toEmailStr,
      },
      'content': contentStr,
      'subject': subStr,
    };
    await fetch(path + '/v0/email/', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          // console.log('repsonse: ', json);
        })
        .catch((error) => {
          console.error('error:', error);
        });
  };

  const getSearchedEmails = async () => {
    await fetch(path + '/v0/email?search=' + searchStr, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          if (json.length > 0) {
            setSearchList(json[0]['mail']);
          } else {
            setSearchList([]);
          }
        });
  };

  const getMailboxList = async () => {
    await fetch(path + '/v0/mailboxes', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          if (!response.ok) {
            throw response;
          }
          return response.json();
        })
        .then((json) => {
          // setMailboxList(json);
          setMailboxList([...new Set([...json, ...customMailboxList])]);
        });
  };

  const putEmail = async () => {
    await fetch(path + '/v0/move/' + viewEmail.id +
      '?mailbox=' + moveToMailbox, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          updateEmailList();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const updateStarredEmail = async () => {
    await fetch(path + '/v0/emailupdate/' + viewEmail.id + '?type=starred', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          updateEmailList();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const updateUnreadEmail = async () => {
    await fetch(path + '/v0/emailupdate/' + viewEmail.id + '?type=unread', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          updateEmailList();
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const getCountStarred = async () => {
    await fetch(path + '/v0/countstarred', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          setCountStarred(json);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  const getCountUnread = async () => {
    let count;
    const unread = {};
    for (let i = 0; i < mailboxList.length; i++) {
      count = await fetch(path + '/v0/countunread?mailbox=' + mailboxList[i], {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })
          .then((response) => {
            return response.json();
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      unread[mailboxList[i]] = count;
    }
    setUnreadMap(unread);
  };

  const updateName = async () => {
    await fetch(path + '/v0/updatename?name=' + username, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
        .catch((error) => {
          console.error('Error:', error);
        });
  };

  return (
    <AppBarContext.Provider value={{handleLeftDrawerToggle,
      handleComposeToggle, setToNameStr, setSubStr, setContentStr,
      setToEmailStr, handleSearchToggle, handleSettingsToggle,
      handleCountStarredUpdate, handleCountUnreadUpdate}}>
      <LeftDrawerContext.Provider value={{handleLeftDrawerToggle,
        leftDrawerOpen, currentMailbox, setCurrentMailbox,
        handleEmailListUpdate, handleMailboxUpdate, customMailboxList,
        setCustomMailboxList, handleMailboxStrChange, newMailboxStr,
        handleNewMailboxKeyDown, handleNewMailboxClick, handlePopupClose,
        popupOpen, popupAnchorEl, mailboxList, handleSettingsToggle,
        countStarred, handleCountStarredUpdate, unreadMap}}>
        <MailboxContext.Provider value={{currentMailbox, emailList,
          handleEmailViewToggle, setViewEmail, setEmailIsStarred,
          emailIsStarred, handleEmailStarredUpdate,
          handleEmailUnreadUpdate}}>
          <EmailContext.Provider value={{viewEmail, handleEmailViewToggle,
            emailOpen, currentMailbox, setToNameStr, setSubStr, setContentStr,
            handleComposeToggle, setToEmailStr, mailboxList,
            setMoveToMailbox, handleMoveUpdate, setCurrentMailbox,
            handleEmailListUpdate, emailIsStarred, setEmailIsStarred,
            handleEmailStarredUpdate, handleEmailUnreadUpdate}}>
            <ComposeContext.Provider value={{composeOpen,
              handleComposeToggle, handleContentChange, contentStr,
              toNameStr, subStr, handleToNameChange, handleSubChange,
              toEmailStr, handleToEmailChange, handleCallSendUpdate,
              handleEmailViewToggle, emailOpen}}>
              <SearchContext.Provider value={{searchOpen, handleSearchToggle,
                searchStr, handleSearchChange, setSearchStr,
                handleCallSearchUpdate, searchList, setViewEmail,
                handleEmailViewToggle, setSearchList}}>
                <SettingsContext.Provider value={{settingsOpen,
                  handleSettingsToggle, handleUsernameStrChange,
                  usernameStr, username, changeNameOpen,
                  changeNameAnchorEl, handleChangeNameClose,
                  handleChangeNameKeyDown, handleChangeNameClick,
                  handleSaveNameUpdate, setUsername}}>
                  <div className={classes.root}>
                    <CssBaseline/>
                    <AppBarComponent />
                    <LeftDrawerComponent />
                    <MailboxComponent />
                    <EmailComponent />
                    <ComposeComponent />
                    <SearchComponent />
                    <SettingsComponent />
                  </div>
                </SettingsContext.Provider>
              </SearchContext.Provider>
            </ComposeContext.Provider>
          </EmailContext.Provider>
        </MailboxContext.Provider>
      </LeftDrawerContext.Provider>
    </AppBarContext.Provider>
  );
}
