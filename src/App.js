import { database } from "./firebase"; 
import { ref, set, get, child } from "firebase/database";
import { useState } from "react";



function getRandomFromList() {
  const numbers = [2, 3];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}


function App() {
  
  const [fetchedQuestion, setFetchedQuestion] = useState(null);
  const [fetchedAnswer, setFetchedAnswer] = useState(null);
  const [userCode,setUserCode]=useState("")
  const [userAnswer,setUserAnswer]=useState("")
  // const [systemCode, setSystemCode] = useState(null);


  const sendDataToRealtimeDB = (data) => {
  const userRef = ref(database, 'responses/Codes');
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
  return get(child(dbRef, `responses/${firebaseData}`)) // ✅ return the Promise
    .then((Snapshot) => {
      if (Snapshot.exists()) {
        return Snapshot.val(); // ✅ returns to the caller
      } else {
        return "⚠ No data available for this name";
      }
    })
    .catch((error) => {
      return `❌ Error fetching data: ${error}`;
    });
};




    // get(child(dbRef, `responses/${question}`))
    //  .then((questionSnapshot) => {
    //   if (questionSnapshot.exists()) {
    //     console.log(questionSnapshot.val())
    //   }
    //   else {
    //       console.log("⚠ No data available for this name");
    //     }
    // })
    //   .catch((error) => {console.error("❌ Error fetching data:", error);})
    // }





  // const fetchDataFromRealtimeDB = (code,question) => {
  //   const dbRef = ref(database);
  //   get(child(dbRef, `responses/${code}`))
  //     .then((codeSnapshot) => {
  //       if (codeSnapshot.exists()) {
  //         if (code==="Codes"){
  //           console.log("📦 Data fetched:", codeSnapshot.val());
  //           let systemCode=codeSnapshot.val()
  //           if (systemCode[userCode]!=undefined){
  //           if ((systemCode[userCode]==2) || (systemCode[userCode]==1)){
  //             let randomID = getRandomFromList()
  //             let questionFlag=true
  //             while (questionFlag){
  //               if (randomID==2){
  //                 get(child(dbRef, `responses/${question}`))
  //                 console.log("hii")
  //                   .then((questionSnapshot) => {
  //                     if (questionSnapshot.exists()) {
  //                       const question_data =questionSnapshot.val()[randomID];
  //                       if (question_data.condition===true){
  //                         setFetchedQuestion(question_data.question);
  //                         setFetchedAnswer(question_data.answer)
  //                         console.log(question_data.question)
  //                         questionFlag=false
  //                       }
  //                       else{
  //                         randomID=randomID*2
  //                         if (randomID > 30){
  //                           randomID=3
  //                         }
  //                       }
  //                     } 
  //                     else {
  //                       console.log("⚠ No data available for this name");
  //                     }
  //                   })
  //                   .catch((error) => {
  //                     console.error("❌ Error fetching data:", error);
  //                   });}
  //                 else if (randomID==3){
  //                 get(child(dbRef, `responses/${question}`))
  //                   .then((questionSnapshot) => {
  //                     if (questionSnapshot.exists()) {
  //                       const question_data =questionSnapshot.val()[randomID];
  //                       if (question_data.condition===true){
  //                         setFetchedQuestion(question_data.question);
  //                         setFetchedAnswer(question_data.answer)
  //                         questionFlag=false
  //                       }
  //                       else{
  //                         randomID=randomID*3
  //                         if (randomID > 30){
  //                           randomID=2
  //                         }
  //                       }
  //                     } 
  //                     else {
  //                       console.log("⚠ No data available for this name");
  //                     }
  //                   })
  //                   .catch((error) => {
  //                     console.error("❌ Error fetching data:", error);
  //                   });}
                  
  //                 }
  //                 if (systemCode[userCode]==2){
  //                   console.log("data updating")
  //                   systemCode={ ...systemCode, [userCode]: 1 };
  //                   handleSendData(systemCode)
  //                 }
  //                 if (systemCode[userCode]==1){
  //                   systemCode={ ...systemCode, [userCode]: 0 };
  //                   handleSendData(systemCode)
  //                 }
                
  //             }}}
          
  //         else{
  //           console.log("Code is not correct")
  //         }

  //       } else {
  //         console.log("⚠ No data available for this name");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("❌ Error fetching data:", error);
  //     });
  // };

  
  const handleSubmitCode = async () => {
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
              console.log(fetchedAnswer,fetchedQuestion)
              questionFlag=false
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
        sendDataToRealtimeDB(codeList);
      }
      else if(codeList[userCode]===1){
        console.log("data updating")
        codeList={ ...codeList, [userCode]: 0 };
        sendDataToRealtimeDB(codeList);
      }
      }
    }


    // sendDataToRealtimeDB(Data);`
  };



  const handleFetchData = async () => {
    
  };


  return (
    <div className="App">
      <input type="text" placeholder="Enter Code" value={userCode} onChange={(e) => setUserCode(e.target.value)}/>
      <button onClick={handleSubmitCode}>Submit Code</button>
      <button onClick={handleFetchData}>Fetch Data from Realtime DB</button>

      {/* {fetchedData && <p>{fetchedData.Condition?.toString()}</p>} */}
    </div>
  );
}

export default App;
