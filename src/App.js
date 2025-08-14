import { database } from "./firebase"; 
import { ref, set, get, child ,update} from "firebase/database";
import { useState, useEffect } from "react";
import independence from './assets/Independence.png';
import titagarh from './assets/Titagarh-Rail-system-logo-Image.png';



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


    // const getTimeDifferenceInSeconds = () => {
    //   if (!codeTime || !answerTime) return null; // Avoid null errors

    //   const diffMs = new Date(answerTime) - new Date(codeTime); // in ms
    //   const diffSec = diffMs / 1000; // in seconds

    //   return diffSec;
    // };


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
       setUserCode("");
        setUserAnswer("");
        setFetchedQuestion("")
        setAnswerTime("")
        setCodeTime("")
      alert("Please select an option!");
    }
    else{
    let codeList = await fetchDataFromRealtimeDB("Codes");
    const questionList = await fetchDataFromRealtimeDB("questions");

    console.log(codeList);
    console.log(questionList);
    console.log(userCode)

    if ((userCode.trim()!=="") && (questionList!==undefined) && (codeList!==undefined)){
                
      if (codeList[userCode.trim()]!==undefined){
        if ((codeList[userCode.trim()]===2) || (codeList[userCode.trim()]===1)){
          let randomID = getRandomFromList()
          const initialNumberID = randomID
          console.log(randomID)
          let questionFlag=true
          while (questionFlag){
            console.log(questionList[randomID].Condition)
            console.log(randomID)
            if (questionList[randomID].Condition===true){
              setFetchedQuestion(questionList[randomID].question);
              setFetchedAnswer(questionList[randomID].answer)
              console.log(questionList[randomID].question,questionList[randomID].answer)
              questionFlag=false
              update(ref(database, `responses/questions/${randomID}`), { Condition: false });
              console.log("question removed")
            }
            else{
              if (initialNumberID===2){
                randomID=randomID+2
                if (randomID > 30){
                  randomID = 3
                }
              }
              else if (initialNumberID===3){
                randomID=randomID+3
                if (randomID > 30){
                  randomID = 2
                }
              }
            }
          }
        }else{
           setUserCode("");
          setUserAnswer("");
          setFetchedQuestion("")
          setAnswerTime("")
          setCodeTime("")
          alert("Code Limit Reached");
        }


      if (codeList[userCode.trim()]===2){
        console.log("data updating")
        codeList={ ...codeList, [userCode.trim()]: 1 };
        sendDataToRealtimeDB(codeList,"Codes");
      }
      else if(codeList[userCode.trim()]===1){
        console.log("data updating")
        codeList={ ...codeList, [userCode.trim()]: 0 };
        sendDataToRealtimeDB(codeList,"Codes");
      }
      const now = new Date();
      const localTime = now.toLocaleString();
      setCodeTime(localTime);
      }
      
    }
    // const now = new Date();
    // const localTime = now.toLocaleString();
    // setCodeTime(localTime);
  }
  };

  const handleSubmitAnswer = async () => {
    if (userAnswer!==""){
    if (selectedValue === "") {
      setUserCode("");
      setUserAnswer("");
      setFetchedQuestion("")
      setAnswerTime("")
      setCodeTime("")
      alert("Please select an option!");
    }
    else{
      const now = new Date();
      const localTime = now.toLocaleString();
      setAnswerTime(localTime);
      console.log(codeTime)
      console.log(answerTime)

      const [answerdatePart, answertimePart] = localTime.split(",").map(s => s.trim());
      console.log(answertimePart.split(" ")[0])
      const answerSplitTime=answertimePart.split(" ")[0]
      const answerminutes=Number(answerSplitTime.split(":")[1])
      const answersecond=Number(answerSplitTime.split(":")[2])
      console.log(answerminutes,answersecond);

      const [codedatePart, codetimePart] = codeTime.split(",").map(s => s.trim());
      console.log(codetimePart.split(" ")[0])
      const codeSplitTime=codetimePart.split(" ")[0]
      const codeminutes=Number(codeSplitTime.split(":")[1])
      const codesecond=Number(codeSplitTime.split(":")[2])
      console.log(codeminutes,codesecond);

      let startTotalSeconds = parseInt(codeminutes) * 60 + parseInt(codesecond);
      let endTotalSeconds = parseInt(answerminutes) * 60 + parseInt(answersecond);
        
      let diffSeconds = endTotalSeconds - startTotalSeconds;
      if (diffSeconds < 0) diffSeconds += 24 * 3600;

        // if ((answerminutes-codeminutes)===0){
          if (diffSeconds<31){
            if (fetchedAnswer!==""){
              if (userAnswer.toLowerCase().trim()===fetchedAnswer.toLowerCase().trim()){
              const Data={
              answer:userAnswer,
              startTime: codeTime,
              endTime: localTime
              }
              sendDataToRealtimeDB(Data,`Teams/${selectedValue}/${fetchedQuestion}`);
              setUserCode("");
              setUserAnswer("");
              setFetchedQuestion("")
              setAnswerTime("")
              setCodeTime("")
              alert("Correct answer Score +1");
              
              }
              else{
                const Data={
                answer:userAnswer,
                 startTime: codeTime,
                endTime: localTime
                }
                sendDataToRealtimeDB(Data,`Teams/Wrong/${selectedValue}/${fetchedQuestion}`);
                setUserCode("");
                setUserAnswer("");
                setFetchedQuestion("")
                setAnswerTime("")
                setCodeTime("")
                alert("Wrong Answer");
              }
            }
          }else{
            const Data={
                answer:userAnswer,
                 startTime: codeTime,
                endTime: localTime
                }
            sendDataToRealtimeDB(Data,`Teams/Wrong/${selectedValue}/${fetchedQuestion}`);
            setUserCode("");
            setUserAnswer("");
            setFetchedQuestion("")
            setAnswerTime("")
            setCodeTime("")
            alert("time exceed above 30 second")
          }
        // }else{
        //   setUserCode("");
        //   setUserAnswer("");
        //   setFetchedQuestion("")
        //   setAnswerTime("")
        //   setCodeTime("")
        //   alert("time exceed above 30 second")}
      } 
  }else{
    setUserCode("");
    setUserAnswer("");
    setFetchedQuestion("")
    setAnswerTime("")
    setCodeTime("")
    alert("Fill answer Field")
  }
    
  };

  useEffect(() => {
      console.log("Answer time updated:", codeTime,answerTime);
    }, [codeTime,answerTime]);

  return (
  <div className="App bg-dark text-light min-vh-100" 
       style={{ 
         backgroundImage: "url('https://images.unsplash.com/photo-1555949963-aa79dcee9810?auto=format&fit=crop&w=1470&q=80')", 
         backgroundSize: 'cover', 
         backgroundPosition: 'center' 
       }}>
    
    <div className="container py-3">
  <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
    <img
      src={independence}
      alt="Logo1"
      className="img-fluid"
      style={{
        maxHeight: '50px',
        filter: 'drop-shadow(2px 2px 2px rgba(255,255,255,0.7))'
      }}
    />
    <img
      src={titagarh}
      alt="Logo2"
      className="img-fluid"
      style={{
        maxHeight: '50px',
        filter: 'drop-shadow(2px 2px 2px rgba(255,255,255,0.7))'
      }}
    />
    <img
      src={independence}
      alt="Logo3"
      className="img-fluid"
      style={{
        maxHeight: '50px',
        filter: 'drop-shadow(2px 2px 2px rgba(255,255,255,0.7))'
      }}
    />
  </div>
</div>

    {/* Quiz Card */}
    <div className="d-flex justify-content-center align-items-center">
      <div className="card shadow-lg p-4 rounded-4 text-center" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'rgba(0,0,0,0.75)' }}>
        <h2 className="mb-4 text-warning">🔥 Hunt Code Quiz 🔥</h2>

        {/* Team Selection */}
        <div className="mb-3 text-start">
          <label className="form-label text-warning">Select Your Team</label>
          <select 
            className="form-select bg-dark text-light border-warning" 
            value={selectedValue} 
            onChange={(e) => setSelectedValue(e.target.value)}
          >
            <option value="">-- Choose your Name --</option>
            <option value="Divyank">Divyank</option>
            <option value="Bhavesh Sanghvi">Bhavesh Sanghvi</option>
            <option value="Jojo Joy">Jojo Joy</option>
            <option value="Adhokshaj">Adhokshaj</option>
            <option value="Akhilesh">Akhilesh</option>
            <option value="Anup Kumar">Anup Kumar</option>
            <option value="Arun Kumar">Arun Kumar</option>
            <option value="Bhagyashri">Bhagyashri</option>
            <option value="Chaitanya">Chaitanya</option>
            <option value="Chandan">Chandan</option>
            <option value="Divya">Divya</option>
            <option value="Ganshyam">Ganshyam</option>
            <option value="Govardhana R">Govardhana R</option>
            <option value="Niharika">Niharika</option>
            <option value="Uday">Uday</option>
            <option value="Omkar">Omkar</option>
            <option value="Pooja">Pooja</option>
            <option value="Rahul Sharma">Rahul Sharma</option>
            <option value="Rahul Upadhyay">Rahul Upadhyay</option>
            <option value="Roshan Kumar">Roshan Kumar</option>
            <option value="Shivanandam">Shivanandam</option>
            <option value="Sachin Sharma">Sachin Sharma</option>
            <option value="Sai Kiran">Sai Kiran</option>
            <option value="Sangeeth">Sangeeth</option>
            <option value="Soumyadwip">Soumyadwip</option>
            <option value="Subhiksha">Subhiksha</option>
            <option value="Avinash">Avinash</option>
            <option value="Vinay N S">Vinay N S</option>
            <option value="Virendra">Virendra</option>
            <option value="Yash">Yash</option>
          </select>
        </div>

        {/* Code Input */}
        <div className="mb-3 text-start">
          <label className="form-label text-warning">Code</label>
          <input 
            type="text" 
            value={userCode} 
            onChange={(e) => setUserCode(e.target.value)}
            className="form-control bg-dark text-light border-warning"
          />
          <button className="btn btn-warning mt-2 w-100" onClick={handleSubmitCode}>
            Submit Code
          </button>
        </div>

        {/* Answer Input */}
        <div className="mb-3 text-start">
          <label className="form-label text-warning">Your Answer</label>
          <input 
            type="text" 
            value={userAnswer} 
            onChange={(e) => setUserAnswer(e.target.value)}
            className="form-control bg-dark text-light border-warning"
          />
          <button className="btn btn-success mt-2 w-100" onClick={handleSubmitAnswer}>
            Submit
          </button>
        </div>

        {/* Question & Time */}
        <div className="mt-4 text-light text-start">
          <h5 className="text-warning">Question:</h5>
          <p className="border p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>{fetchedQuestion}</p>

          <h6 className="text-warning mt-3">Code Time:</h6>
          <p>{codeTime}</p>

          <h6 className="text-warning mt-2">Answer Time:</h6>
          <p>{answerTime}</p>
        </div>
      </div>
    </div>
  </div>
);

}

export default App;
