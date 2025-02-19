// src/App.js
import React from 'react';
import './App.css';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/Chatpage';
import Welcomepagee from './Pages/Welcomepagee';

function App() {
  return (
    <div className="App">
      <div className="App">
      <Route path="/" component={Welcomepagee} exact />  {/* Default welcome page */}
      <Route path="/login-signup" component={Homepage} />  {/* Login-signup page */}
      <Route path="/chats" component={ChatPage} />
    </div>
    </div>
  );
}

export default App;
