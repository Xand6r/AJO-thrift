import React from "react";
import {ethers} from 'ethers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from 'react-toastify';
import HomePage from "./pages/home";
import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  function getLibrary(provider) {
    const gottenProvider = new ethers.providers.Web3Provider(provider, "any"); // this will vary according to whether you use e.g. ethers or web3.js
    // adding this is important to deal with changing networks
    gottenProvider.on("network", (_, oldNetwork) => {
    //   if (oldNetwork) {
    //     window.location.reload();
    //   }
    });
    return gottenProvider;
  }
  return (
    <div>
      <Web3ReactProvider  getLibrary={getLibrary}>
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
          </Routes>
        </BrowserRouter>
      </Web3ReactProvider>
      <ToastContainer />
    </div>
  );
}
