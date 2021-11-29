import React from "react";
import {ethers} from 'ethers';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { ToastContainer } from 'react-toastify';

import NavBar from './components/navbar';
import HomePage from "./pages/home";
import Cooperative from "./pages/cooperative";
import LostPage from "./pages/lost";

import 'react-toastify/dist/ReactToastify.css';


export default function App() {
  function getLibrary(provider) {
    const gottenProvider = new ethers.providers.Web3Provider(provider, "any"); // this will vary according to whether you use e.g. ethers or web3.js
    return gottenProvider;
  }
  return (
    <div>
      <Web3ReactProvider  getLibrary={getLibrary}>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/cooperative/:address" exact element={<Cooperative />} />
            <Route path="*" exact element={<LostPage />} />
          </Routes>
        </BrowserRouter>
      </Web3ReactProvider>
      <ToastContainer />
    </div>
  );
}
