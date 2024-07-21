import engine from "../assets/engine.jpg";
import carCrash from "../assets/car-crash.jpg";
import manTalking from "../assets/talking-in-car.jpg";
import carInsurance from "../assets/car-insurance.png";
import businessman from "../assets/businessman.jpg";
import "../styles/content.css";
import { useState, useMemo } from "react";

function Content() {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  // Array of content elements
  const contentElements = useMemo(
    () => [
      <div key="content1">
        <p>
          If you are getting Finance, your Mechanical Breakdown Insurance can be
          included in your loan. And remember, you can get Mechanical Breakdown
          Insurance for any vehicle, even if you didn’t buy it at Turners
          (subject to underwriting criteria).
        </p>
        <p>
          Cover is available for different types and categories of vehicles.
        </p>
      </div>,
      <div key="content2">
        <p>
          If you already have mechanical breakdown insurance, phone 0800 809 700
          to get AA Roadservice.
        </p>
        <p>
          If your car has broken down, you’d like support with your policy or
          information on making a claim.
        </p>
        <p>Please note: pre-existing faults are not covered by the policy.</p>
        <p>
          Please refer to the policy wording for full policy terms and
          conditions.
        </p>
        <p>
          *Turners Mechanical Breakdown Insurance is underwritten by DPL
          Insurance.
        </p>
      </div>,
    ],
    []
  );

  // Function to go to the next content
  const handleNextContent = () => {
    setCurrentContentIndex(
      (prevIndex) => (prevIndex + 1) % contentElements.length
    );
  };

  // Function to go back to the previous content
  const handlePreviousContent = () => {
    setCurrentContentIndex(
      (prevIndex) =>
        (prevIndex - 1 + contentElements.length) % contentElements.length
    );
  };

  return (
    <div className="content-container">
      <div className="second-content">
        <div className="breakdown-list">
          <h3>
            Mechanical Breakdown Insurance covers the cost of repairing your car
            if you have mechanical or electrical failure.
          </h3>
          <ul>
            <li>Engine</li>
            <li>Transmission</li>
            <li>Steering</li>
            <li>Brakes</li>
            <li>Electrical</li>
            <li>Air Conditioning</li>
          </ul>
          <h4>
            Get a quick quote today, call 0800 TURNERS (0800 887 637) or email
            us at contact@turners.co.nz
          </h4>
        </div>
        <div className="breakdown-image">
          <img
            src={manTalking}
            alt="Man talking in a car"
            className="man-in-car"
          />
        </div>
      </div>

      <div className="third-content">
        <div className="third-content-statement">
          <h3>Protect yourself against unexpected costs.</h3>
          <p>
            If you own or buy a second hand car, make sure you’re covered for
            unforeseen and sudden mechanical and electrical breakdowns.
          </p>
        </div>
        <div>
          <img src={carInsurance} alt="Car insurance" />
        </div>
      </div>

      <div className="fourth-content">
        <div className="fourth-content-image">
          <img src={businessman} alt="Businessman" />
        </div>
        <div className="fourth-content-statement">
          {contentElements[currentContentIndex]}
          <button onClick={handlePreviousContent}>Previous</button>
          <button onClick={handleNextContent}>Next</button>
        </div>
      </div>
    </div>
  );
}

export default Content;
