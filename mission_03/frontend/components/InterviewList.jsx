import React, { useState, useEffect } from "react";
import axios from "axios";

const InterviewList = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3023/api/interviews"
        );
        setInterviews(response.data);
      } catch (error) {
        console.error("Error fetching interview data:", error);
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div>
      <h1>Interview Questions and Answers</h1>
      <ul>
        {interviews.map((interview, index) => (
          <li key={index}>
            <strong>Job Title:</strong> {interview.jobTitle}
            <br />
            <strong>Company:</strong> {interview.company}
            <br />
            <strong>Question:</strong> {interview.question}
            <br />
            <strong>Answer:</strong> {interview.answer}
            <br />
            <strong>Created At:</strong>{" "}
            {new Date(interview.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewList;
