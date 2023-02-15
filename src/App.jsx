import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from './utils/FeedBack.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);

const contractAddress = '0xE3c248621Ee37c4E19F66d49D53e325A24a06e29'; 

const contractABI = abi.abi;

function FeedbackForm() {
  const [feedbacks, setFeedbacks] = useState([]);

  async function loadFeedbacks() {
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const feedbacks = await contract.getFeedbacks();
    setFeedbacks(feedbacks);
  }

  useEffect(() => {
    loadFeedbacks();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const message = event.target.message.value;
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    await contract.submitFeedback(message);
    loadFeedbacks();
  }

  return (
    <div className="mainSect">
    <section className="gistArea">
       <header className="header">
            Welcome To Dgist Zone 🤗.
          </header>
       <p className="slogan"> Your opinion counts... </p>

      <h2>Trending Subject: <h4>Who do you think will win presidential election?</h4></h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="message">Feedback:</label>
        <textarea id="message" name="message" rows="5" cols="40" />
        <button type="submit">Submit</button>
      </form>
      <ul>
        {feedbacks.map((feedback, index) => (
          <li key={index}>
            <p>Address: {feedback.sender}</p>
            <p>Message: {feedback.message}</p>
            <p>Time: {new Date(feedback.timestamp * 1000).toLocaleString()}</p>
          </li>
        ))}
      </ul></section>
    </div>
  );
}

function ConnectWalletButton() {
  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <button onClick={connectWallet}>Connect Wallet</button>
  );
}

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(window.ethereum?.selectedAddress != null);
  }, []);

  
  return (
   
    <div>
      {connected ? <FeedbackForm /> : <ConnectWalletButton />}
    </div>
  );
}

export default App;
