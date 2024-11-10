import React, { useState, useRef, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';

// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/l9jLEq7RE/";

let model, webcam, labelContainer, maxPredictions;

// Custom messages for each class
const customMessages = {
  'Reusable Waterbottle': "Financially responsible AND saving plastic!",
  'Redbull': "Not financially responsible! Get some sleep and drink coffee from home.",
  'iPhone': "Financially responsible! A powerful and efficient device to help you be more productive!",
  'Contact Lenses': "Not financially responsible! Choose mindfully when purchasing, or wear your glasses more!"
};

function Classifier() {
  // State to manage loading and predictions
  const [isLoading, setIsLoading] = useState(true);
  const [predictions, setPredictions] = useState([]);
  const webcamRef = useRef(null); // Ref for webcam container

  // Initialize the model and webcam when the component mounts
  useEffect(() => {
    const loadModelAndStartWebcam = async () => {
      const modelURL = `${URL}model.json`;
      const metadataURL = `${URL}metadata.json`;

      try {
        // Load the Teachable Machine model
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses(); // Get the number of prediction classes
        setIsLoading(false);

        // Set up the webcam
        const flip = true; // Flip the webcam image
        webcam = new tmImage.Webcam(200, 200, flip); // Create the webcam instance
        await webcam.setup(); // Set up the webcam
        await webcam.play(); // Start playing the webcam

        // Append webcam canvas to the DOM
        webcamRef.current.appendChild(webcam.canvas);

        // Start the prediction loop
        window.requestAnimationFrame(loop);
      } catch (error) {
        console.error("Error loading model or starting webcam:", error);
        setIsLoading(false);
      }
    };

    loadModelAndStartWebcam();

    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, []); // Empty dependency array ensures this runs once after the initial render

  // Function to continuously make predictions
  async function loop() {
    webcam.update(); // Update the webcam frame
    await predict(); // Make prediction on the updated frame
    window.requestAnimationFrame(loop); // Continue the loop
  }

  // Function to make predictions on the webcam frame
  async function predict() {
    const prediction = await model.predict(webcam.canvas); // Make prediction with the model

    // Sort the predictions in descending order of probability
    const sortedPredictions = prediction.sort((a, b) => b.probability - a.probability);

    // Get the top prediction
    const topPrediction = sortedPredictions[0];

    // Get the custom message for the top prediction
    const customMessage = customMessages[topPrediction.className] || "Make the best decision!";

    // Update predictions state
    setPredictions([`${topPrediction.className}: ${topPrediction.probability.toFixed(2)}`, customMessage]);
  }

  // Handle the "Start!" button click event
  const handleStart = () => {
    if (isLoading) {
      alert("Model is still loading...");
    } else {
      console.log("Webcam initialized, predictions will start!");
    }
  };

  return (
    <div className="bubble">
      <h1>Financial Decision Detector 📷</h1>
      <p>
        Use this image classifier on nearby objects to know if you're making the right financial decision!
      </p>

      {/* Start button to trigger webcam initialization */}
      <button type="button" onClick={handleStart}>
        Start!
      </button>

      {/* Webcam container */}
      <div id="webcam-container" ref={webcamRef}></div>

      {/* Display only the prediction and custom message */}
      {isLoading && <p>Loading model...</p>}
      {!isLoading && predictions.length > 0 && (
        <div>
          <h2>Prediction:</h2>
          <p>{predictions[0]}</p>  {/* This shows 'iPhone: 0.96' */}
          <p>{predictions[1]}</p>  {/* This shows your custom message */}
        </div>
      )}
    </div>
  );
}

export default Classifier;

// THE GOOD ONE ------------------
// import React, { useState, useRef, useEffect } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as tmImage from '@teachablemachine/image';

// // Teachable Machine model URL
// const URL = "https://teachablemachine.withgoogle.com/models/l9jLEq7RE/";

// let model, webcam, labelContainer, maxPredictions;

// // Custom messages for each class
// const customMessages = {
//   'Reusable Waterbottle': "Great choice! Stay hydrated and save the planet!",
//   'Redbull': "Energy boost! Keep going strong!",
//   'iPhone': "Looks like you're making a tech upgrade!",
//   'Contact Lenses': "Clear vision ahead, you're ready to go!"
// };

// function Classifier() {
//   // State to manage loading and predictions
//   const [isLoading, setIsLoading] = useState(true);
//   const [predictions, setPredictions] = useState([]);
//   const webcamRef = useRef(null); // Ref for webcam container
//   const labelContainerRef = useRef(null); // Ref for label container

//   // Initialize the model and webcam when the component mounts
//   useEffect(() => {
//     const loadModelAndStartWebcam = async () => {
//       const modelURL = `${URL}model.json`;
//       const metadataURL = `${URL}metadata.json`;

//       try {
//         // Load the Teachable Machine model
//         model = await tmImage.load(modelURL, metadataURL);
//         maxPredictions = model.getTotalClasses(); // Get the number of prediction classes
//         setIsLoading(false);

//         // Set up the webcam
//         const flip = true; // Flip the webcam image
//         webcam = new tmImage.Webcam(200, 200, flip); // Create the webcam instance
//         await webcam.setup(); // Set up the webcam
//         await webcam.play(); // Start playing the webcam

//         // Append webcam canvas to the DOM
//         webcamRef.current.appendChild(webcam.canvas);

//         // Set up the label container for displaying predictions
//         labelContainer = labelContainerRef.current;
//         for (let i = 0; i < maxPredictions; i++) {
//           labelContainer.appendChild(document.createElement("div"));
//         }

//         // Start the prediction loop
//         window.requestAnimationFrame(loop);
//       } catch (error) {
//         console.error("Error loading model or starting webcam:", error);
//         setIsLoading(false);
//       }
//     };

//     loadModelAndStartWebcam();

//     return () => {
//       if (webcam) {
//         webcam.stop();
//       }
//     };
//   }, []); // Empty dependency array ensures this runs once after the initial render

//   // Function to continuously make predictions
//   async function loop() {
//     webcam.update(); // Update the webcam frame
//     await predict(); // Make prediction on the updated frame
//     window.requestAnimationFrame(loop); // Continue the loop
//   }

//   // Function to make predictions on the webcam frame
//   async function predict() {
//     const prediction = await model.predict(webcam.canvas); // Make prediction with the model

//     // Sort the predictions in descending order of probability
//     const sortedPredictions = prediction.sort((a, b) => b.probability - a.probability);

//     // Get the top prediction
//     const topPrediction = sortedPredictions[0];

//     // Get the custom message for the top prediction
//     const customMessage = customMessages[topPrediction.className] || "Make the best decision!";

//     // Update predictions state and UI
//     setPredictions([`${topPrediction.className}: ${topPrediction.probability.toFixed(2)}`, customMessage]);

//     // Update the label container with just the top prediction and custom message
//     labelContainer.childNodes[0].innerHTML = `${topPrediction.className}: ${topPrediction.probability.toFixed(2)}`;
//     labelContainer.childNodes[1].innerHTML = customMessage; // Add your custom message
//   }

//   // Handle the "Start!" button click event
//   const handleStart = () => {
//     if (isLoading) {
//       alert("Model is still loading...");
//     } else {
//       console.log("Webcam initialized, predictions will start!");
//     }
//   };

//   return (
//     <div className="bubble">
//       <h1>Financial Decision Detector 📷</h1>
//       <p>
//         Use this image classifier on nearby objects to know if you're making the right financial decision!
//       </p>

//       {/* Start button to trigger webcam initialization */}
//       <button type="button" onClick={handleStart}>
//         Start!
//       </button>

//       {/* Webcam container */}
//       <div id="webcam-container" ref={webcamRef}></div>

//       {/* Label container for showing predictions */}
//       <div id="label-container" ref={labelContainerRef}></div>

//       {/* Loading or predictions */}
//       {isLoading && <p>Loading model...</p>}
//       {!isLoading && predictions.length > 0 && (
//         <div>
//           <h2>Prediction:</h2>
//           <p>{predictions[0]}</p>  {/* This will show something like 'iPhone: 0.99' */}
//           <p>{predictions[1]}</p>  {/* This will show your custom message */}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Classifier;

// ++++++++++++++++++++ BRING IT ALL BACK IF ALL ELSE FAILS!
// import React, { useState, useRef, useEffect } from 'react';
// import * as tf from '@tensorflow/tfjs';
// import * as tmImage from '@teachablemachine/image';

// // Teachable Machine model URL
// const URL = "https://teachablemachine.withgoogle.com/models/l9jLEq7RE/";

// let model, webcam, labelContainer, maxPredictions;

// function Classifier() {
//   // State to manage loading and predictions
//   const [isLoading, setIsLoading] = useState(true);
//   const [predictions, setPredictions] = useState([]);
//   const webcamRef = useRef(null); // Ref for webcam container
//   const labelContainerRef = useRef(null); // Ref for label container

//   // Initialize the model and webcam when the component mounts
//   useEffect(() => {
//     const loadModelAndStartWebcam = async () => {
//       const modelURL = `${URL}model.json`;
//       const metadataURL = `${URL}metadata.json`;

//       try {
//         // Load the Teachable Machine model
//         model = await tmImage.load(modelURL, metadataURL);
//         maxPredictions = model.getTotalClasses(); // Get the number of prediction classes
//         setIsLoading(false);

//         // Set up the webcam
//         const flip = true; // Flip the webcam image
//         webcam = new tmImage.Webcam(200, 200, flip); // Create the webcam instance
//         await webcam.setup(); // Set up the webcam
//         await webcam.play(); // Start playing the webcam

//         // Append webcam canvas to the DOM
//         webcamRef.current.appendChild(webcam.canvas);

//         // Set up the label container for displaying predictions
//         labelContainer = labelContainerRef.current;
//         for (let i = 0; i < maxPredictions; i++) {
//           labelContainer.appendChild(document.createElement("div"));
//         }

//         // Start the prediction loop
//         window.requestAnimationFrame(loop);
//       } catch (error) {
//         console.error("Error loading model or starting webcam:", error);
//         setIsLoading(false);
//       }
//     };

//     loadModelAndStartWebcam();

//     return () => {
//       if (webcam) {
//         webcam.stop();
//       }
//     };
//   }, []); // Empty dependency array ensures this runs once after the initial render

//   // Function to continuously make predictions
//   async function loop() {
//     webcam.update(); // Update the webcam frame
//     await predict(); // Make prediction on the updated frame
//     window.requestAnimationFrame(loop); // Continue the loop
//   }

//   // Function to make predictions on the webcam frame
//   async function predict() {
//     const prediction = await model.predict(webcam.canvas); // Make prediction with the model

//     // Update predictions state and UI
//     const updatedPredictions = [];
//     for (let i = 0; i < maxPredictions; i++) {
//       const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
//       updatedPredictions.push(classPrediction);
//       labelContainer.childNodes[i].innerHTML = classPrediction; // Update the label container
//     }
//     setPredictions(updatedPredictions); // Set predictions to state
//   }

//   // Handle the "Start!" button click event
//   const handleStart = () => {
//     if (isLoading) {
//       alert("Model is still loading...");
//     } else {
//       console.log("Webcam initialized, predictions will start!");
//     }
//   };

//   return (
//     <div className="bubble">
//       <h1>Financial Decision Detector 📷</h1>
//       <p>
//         Use this image classifier on nearby objects to know if you're making the right financial decision!
//       </p>

//       {/* Start button to trigger webcam initialization */}
//       <button type="button" onClick={handleStart}>
//         Start!
//       </button>

//       {/* Webcam container */}
//       <div id="webcam-container" ref={webcamRef}></div>

//       {/* Label container for showing predictions */}
//       <div id="label-container" ref={labelContainerRef}></div>

//       {/* Loading or predictions */}
//       {isLoading && <p>Loading model...</p>}
//       {!isLoading && predictions.length > 0 && (
//         <div>
//           <h2>Predictions:</h2>
//           <ul>
//             {predictions.map((prediction, index) => (
//               <li key={index}>{prediction}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Classifier;