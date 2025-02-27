import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from "@chakra-ui/react"; // Ensure correct import
import ChatProvider from "./Context/ChatProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ChatProvider> 
      <ChakraProvider> {/* Wrap App with ChakraProvider */}
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>
);