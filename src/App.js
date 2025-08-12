
import { database } from "./firebase"; // Make sure this matches your file name
import { ref, set } from "firebase/database";

const sendDataToRealtimeDB = (data) => {
  const userRef = ref(database, 'responses/' + data.name); // Using name as key
  set(userRef, data)
    .then(() => {
      console.log("Data successfully written to Realtime Database");
    })
    .catch((error) => {
      console.error("Error writing to Realtime Database:", error);
    });
};




function App() {
  const handleSendData = () => {
    const sampleData = {
      name: "Divyank",
      score: 92,
      submittedAt: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) 
    };
    sendDataToRealtimeDB(sampleData);
  };

  return (
    <div className="App">
        <button onClick={handleSendData}>Send Data to Realtime DB</button>
    </div>
  );
}

export default App;
