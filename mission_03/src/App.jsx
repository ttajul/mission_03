import React from "react";
import Navbar from "../frontend/components/Navbar";
import Hero from "../frontend/components/Hero";
import Content from "../frontend/components/Content";
import Footer from "../frontend/components/Footer";
import Chatbot from "../frontend/components/Chatbot";
import InterviewList from "../frontend/components/InterviewList";
import "./App.css";

function App() {
  return (
    <>
      <Navbar></Navbar>
      <Hero></Hero>
      <Content></Content>
      <Chatbot></Chatbot>
      <InterviewList></InterviewList>
      <Footer></Footer>
    </>
  );
}

export default App;
