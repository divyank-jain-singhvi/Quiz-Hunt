import { database } from "./firebase"; 
import { ref, set, get, child ,update} from "firebase/database";
import { useState } from "react";



function getRandomFromList() {
  const numbers = [2, 3];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}


function App() {
  
  const [fetchedQuestion, setFetchedQuestion] = useState("");
  const [fetchedAnswer, setFetchedAnswer] = useState("");
  const [userCode,setUserCode]=useState("")
  const [userAnswer,setUserAnswer]=useState("")
  const [selectedValue, setSelectedValue] = useState("");
  const [codeTime, setCodeTime] = useState(null);
  const [answerTime, setAnswerTime] = useState(null);


  const sendDataToRealtimeDB = (data,path) => {
  const userRef = ref(database, 'responses/'+path);
  set(userRef, data)
    .then(() => {
      console.log("✅ Data successfully written to Realtime Database");
    })
    .catch((error) => {
      console.error("❌ Error writing to Realtime Database:", error);
    });
  };




const fetchDataFromRealtimeDB = (firebaseData) => {
  const dbRef = ref(database);
  return get(child(dbRef, `responses/${firebaseData}`)) 
    .then((Snapshot) => {
      if (Snapshot.exists()) {
        return Snapshot.val(); 
      } else {
        return "⚠ No data available for this name";
      }
    })
    .catch((error) => {
      return `❌ Error fetching data: ${error}`;
    });
};
  


  const handleSubmitCode = async () => {
    
    if (selectedValue === "") {
      alert("Please select an option!");
    }
    else{
    let codeList = await fetchDataFromRealtimeDB("Codes");
    const questionList = await fetchDataFromRealtimeDB("questions");

    console.log(codeList);
    console.log(questionList);
    console.log(userCode)

    if ((userCode!=="") && (questionList!==undefined) && (codeList!==undefined)){
                
      if (codeList[userCode]!==undefined){
        if ((codeList[userCode]===2) || (codeList[userCode]===1)){
          let randomID = getRandomFromList()
          console.log(randomID)
          let questionFlag=true
          while (questionFlag){
            console.log(questionList[randomID].Condition)
            if (questionList[randomID].Condition===true){
              setFetchedQuestion(questionList[randomID].question);
              setFetchedAnswer(questionList[randomID].answer)
              console.log(questionList[randomID].question,questionList[randomID].answer)
              questionFlag=false
              update(ref(database, `responses/questions/${randomID}`), { Condition: false });
              console.log("question removed")
            }
            else{
              if (randomID===2){
                randomID=randomID*2
                if (randomID > 30){
                  randomID = 3
                }
              }
              else if (randomID===3){
                randomID=randomID*3
                if (randomID > 30){
                  randomID = 2
                }
              }
            }
          }
        }
      if (codeList[userCode]===2){
        console.log("data updating")
        codeList={ ...codeList, [userCode]: 1 };
        sendDataToRealtimeDB(codeList,"Codes");
      }
      else if(codeList[userCode]===1){
        console.log("data updating")
        codeList={ ...codeList, [userCode]: 0 };
        sendDataToRealtimeDB(codeList,"Codes");
      }
      
      }
    }
    const now = new Date();
    const localTime = now.toLocaleString();
    setCodeTime(localTime);
  }
  };

  const handleSubmitAnswer = async () => {
    if (selectedValue === "") {
      alert("Please select an option!");
    }
    else{
      const now = new Date();
      const localTime = now.toLocaleString();
      setAnswerTime(localTime);
      if (userAnswer===fetchedAnswer){
      const Data={
      answer:userAnswer,
      }
      sendDataToRealtimeDB(Data,`Teams/${selectedValue}/${fetchedQuestion}`);
      alert("Correct answer Score +1");
      setUserCode("");
      setUserAnswer("");
    }
    else{
      alert("Wrong Answer");
      setUserCode("");
      setUserAnswer("");
    }}
    
  };


  return (
    <div className="App">

      <h5>Select Your team</h5>

      <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
        <option value="">-- Choose your Team --</option>
        <option value="Alpha">Divyank</option>
        <option value="Beta">Bhavesh Sanghvi</option>
        <option value="Gama">Jojo Joy</option>
        <option value="Delta">Adhokshaj</option>
        <option value="Epsilon">Akhilesh</option>
        <option value="Alpha">Anup Kumar</option>
        <option value="Beta">Arun Kumar</option>
        <option value="Gama">Bhagyashri</option>
        <option value="Delta">Chaitanya</option>
        <option value="Epsilon">Chandan</option>
        <option value="Alpha">Divya</option>
        <option value="Beta">Ganshyam</option>
        <option value="Gama">Govardhana R</option>
        <option value="Delta">Niharika</option>
        <option value="Epsilon">Uday</option>
        <option value="Alpha">Omkar</option>
        <option value="Beta">Pooja</option>
        <option value="Gama">Rahul Sharma</option>
        <option value="Delta">Rahul Upadhyay</option>
        <option value="Epsilon">Roshan Kumar</option>
        <option value="Gama">Shivanandam</option>
        <option value="Delta">Sachin Sharma</option>
        <option value="Epsilon">Sai Kiran</option>
        <option value="Gama">Sangeeth</option>
        <option value="Delta">Soumyadwip</option>
        <option value="Epsilon">Subhiksha</option>
        <option value="Gama">Avinash</option>
        <option value="Delta">Vinay N S</option>
        <option value="Epsilon">Virendra</option>
        <option value="Epsilon">Yash</option>
      </select>

      <input type="text" placeholder="Enter Code" value={userCode} onChange={(e) => setUserCode(e.target.value)}/>
      <button onClick={handleSubmitCode}>Submit Code</button>
      <input type="text" placeholder="Enter Your Answer" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}/>
      <button onClick={handleSubmitAnswer}>Submit</button>

      <p>{fetchedQuestion}</p>
      <p>{codeTime}</p>
      <p>{answerTime}</p>
    </div>
  );
}

export default App;
