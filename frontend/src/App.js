// importing required modules

import "./App.css";
import Alert from "@mui/material/Alert";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import ProgressModal from "./components/ProgressModal";
import DataTable from "./components/DataTable";
import api from "./utils/ApiConfing";
import { getCountries , getLanguages} from 'cldr-language-country';



// import end

// main App functional component
function App() {


  const [geoData, setgeoData] = useState({countries:[],languages:[]});
  let initial_selectedGeoData = {country:{ code: 'US', name: 'United States' },
  language:{ code: 'en', name: 'English', native: 'English' }};
  const [selectedGeoData, setselectedGeoData] = useState({country:{ code: 'US', name: 'United States' },
  language:{ code: 'en', name: 'English', native: 'English' }})
  useEffect(() => {


    // get all countries and language
    let temp_countries = getCountries();
    let temp_languages = getLanguages();
    setgeoData({countries:temp_countries,languages:temp_languages})
    
    // warning on reload
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  
    
  
  }, []);
  // raw domain text - "abc.com \n def.com \n" and total domains count
  const [domains, setdomains] = useState({
    domainsData: "",
    totalDomainsCount: 0,
  });

  // alert snakbar for empty field warning or already in process - error
  const [alertData, setalertData] = useState({
    show: false,
    msg: "this is error alert",
  });

  async function wait(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  // data for showing progress
  let initialProgressData = {
    isProcessing: false,
    checkedDomainsCount: 0,
    timeRemaining: 0,
    timeElapsed: 0,
    showResults: false,
  };
  const [progressData, setprogressData] = useState({ ...initialProgressData });
  // time in seconds

  // to stop process
  const [terminateProcess, setterminateProcess] = useState(false);

 

  // final result - domain - indexed:true/false
  const [result, setresult] = useState({rows:[],indexedCount:0,nonIndexedCount:0});

  // main function that checks indexing for google news

  const analyse = async () => {
    // if domains are empty show alert
    if (domains.domainsData.trim().length == 0) {
      // if already alert is shown- do nothing
      if (alertData.show && alertData.msg == "domains names can not be empty") {
        return;
      }

      setalertData({ show: true, msg: "domains names can not be empty" });
      // hide alert in 3s
      setTimeout(() => {
        setalertData({ show: false, msg: "this is error alert" });
      }, 3000);

      return;
    }
    // if already processing - show alert
    if (progressData.isProcessing) {
      // if alert is already visible - do nothing
      if (
        alertData.show &&
        alertData.msg == "another task is already processing, please wait.."
      ) {
        return;
      }
      setalertData({
        show: true,
        msg: "another task is already processing, please wait..",
      });
      // hide alert after 3s
      setTimeout(() => {
        setalertData({ show: false, msg: "this is error alert" });
      }, 3000);
      return;
    }

    // start checking for indexing

    // get domains name from raw domain  data as array
    let domainArray = domains.domainsData.split("\n");

    // set progress data to initial values - except isProcessing
    setprogressData((data) => ({ ...initialProgressData, isProcessing: true }));

    let temp_timeElapsed = 0;
    // update time elapsed
    let timeElapsedTimer = setInterval(() => {
      // increase timeElapsed - by one second after each second
      temp_timeElapsed++;
      setprogressData((data) => ({ ...data, timeElapsed: temp_timeElapsed }));
    }, 1000);

    // stores results in a temp array
    let temp_results = [];
    // check index for each domain stored in domainArray

    let temp_indexedCount=0;
    let temp_nonIndexedCount =0;

    let temp_terminate = false;
    for (let i = 0; i < domainArray.length; i++) {
      // terminate process- stoped by user
      setterminateProcess((state)=>{
        temp_terminate=state;
        return state;
      })
      if (temp_terminate) {
        setprogressData((data) => ({
          ...data,
          isProcessing: false,
          showResults: true,
        }));

        break;
      }
      
      if (domainArray[i].trim().length == 0) {
        // if domain is not last - and is empty dont check for indexing. just increase checked domain count.
        // if it is last domain and empty we have already exclude it in total domain count - in updateDomain function
        if (i != domainArray.length - 1) {
          setprogressData((data) => ({
            ...data,
            checkedDomainsCount: data.checkedDomainsCount + 1,
          }));
        }

        continue;
      }
// for development - illusion of api call 
      // await wait(1000);
      // temp_results.push({ id: i + 1, domain: "tempDomain", indexed: "fsdafasdfasdfasdfasdfasdfasdfasdfasdfsdf" });

      // call api - response = {success:true ,domain:abc.com , indexed:true }
      await api.get(`/api/checkIndexing/`,{ params: { domain: domainArray[i],
      cc:selectedGeoData.country.code,
      lc:selectedGeoData.language.code
      } }).then((res)=>{
          // put result data in temp_results array
        temp_results.push( { id: i+1, domain: res.data.domain, indexed: res.data.indexed })
           if(res.data.indexed){ temp_indexedCount++;}
           else{ temp_nonIndexedCount++;}
      }).catch((e)=>{
        temp_results.push( { id: i+1, domain: domainArray[i], indexed: "error"  })

      })

      // avg time took for a single domain * remaing domains count
      //i+1 == checked domains count
      let temp_timeRemaining =
        (temp_timeElapsed / (i + 1)) * (domains.totalDomainsCount - i - 1);
       temp_timeRemaining = Math.floor(temp_timeRemaining);
      setprogressData((data) => ({
        ...data,
        timeRemaining: temp_timeRemaining,
        checkedDomainsCount: i + 1,
      }));
    }
    // update result
    // setresultRows([...temp_results]);
    setresult((data)=>({rows:[...temp_results],indexedCount:temp_indexedCount,nonIndexedCount:temp_nonIndexedCount}))
    // close time elpased time interval
    clearInterval(timeElapsedTimer);
    // update progress data
    setprogressData((data) => ({
      ...data,
      isProcessing: false,
      showResults: true,
    }));
  };

  // update domains name and total count as user types
  const updatedomains = (event) => {
    let tempDomainsArray = event.target.value.split("\n");
    let temp_length= tempDomainsArray.length;

    if (tempDomainsArray[temp_length - 1].trim().length == 0) {
      // if last domain is empty , dont count it. (user may press enter after last domain - ignore it)
      temp_length--;
    }
    setdomains((data) => ({ domainsData:event.target.value, totalDomainsCount: temp_length }));
  };

  // remove results and reset everything
  const StartFreshSearch = () => {
    setresult({rows:[],indexedCount:0,nonIndexedCount:0});
    setterminateProcess(false);
    setdomains({domainsData:[],totalDomainsCount:0})
    setprogressData({ ...initialProgressData });
  };


  // called by progress modal
  const stopProcess = ()=>{

  setterminateProcess(true);
   
  }

  return (
    <div className="App">
      {/* hide search box if processing or showing results  */}
      <div
        style={{
          height: "100vh",
          display:
            progressData.isProcessing || progressData.showResults
              ? "none"
              : "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="searchBox">
          <h1>check SEO for google news</h1>

          <textarea
            name="domainsInptField"
            id="domainsInptField"
            placeholder={`Enter domains
abc.com
def.in
efgsa.co.in`}
            value={domains.domainsData}
            onChange={(e) => updatedomains(e)}
          ></textarea>
          
            <p className="helperText">total domains Entered: {domains.totalDomainsCount}</p>
          <div style={{width:'100%',display:'flex',justifyContent:'space-between',
          columnGap:'25px',
          alignItems:"center"}}>

          <Autocomplete
  disablePortal
  id="country-box"
  value={selectedGeoData.country}
  onChange={(e,newValue)=>{
    if(newValue){

      setselectedGeoData((data)=>({...data,country:newValue}))
    }
    else{
      setselectedGeoData((data)=>({...data,country:initial_selectedGeoData.country}))

    }
  }}
  options={geoData.countries}
  getOptionLabel={(option) => option.name}
  sx={{ flex: 1 }}
  size='small'
  renderInput={(params) => <TextField {...params} label="Country" />}
/>

<Autocomplete
  disablePortal
  id="language-box"
  options={geoData.languages}
  getOptionLabel={(option) => option.name}
  sx={{ flex: 1 }}
  value={selectedGeoData.language}
  onChange={(e,newValue)=>{
    if(newValue){
      setselectedGeoData((data)=>({...data,language:newValue}))
      
    }
    else{
      setselectedGeoData((data)=>({...data,language:initial_selectedGeoData.language}))

    }
  }
}
  size='small'
  renderInput={(params) => <TextField {...params} label="language"/>}
/>
          </div>
         
          {/* start analyse button  */}
          <button id="analyseBtn" onClick={analyse}>
            Analyse<span className="icon-right"></span>
            <span className="icon-right after"></span>
          </button>
          {/* start analyse button  end */}

          {/* alert for empty domains  */}
          <div className="alertContainer">
            {alertData.show ? (
              <Alert severity="error">{alertData.msg}</Alert>
            ) : (
              ""
            )}
          </div>
          {/* alert ends */}
        </div>
      </div>
      {/* search box ends  */}
      
      {/*  progress dialog  */}
      <div>
        {progressData.isProcessing ? (
          <ProgressModal
           progressData={progressData}
           stopProcess={stopProcess}
            totalDomainsCount={domains.totalDomainsCount}
          />
        ) : (
          ""
        )}
      </div>
      {/* progress dialog ends  */}

      {/* results  */}
      {progressData.showResults ? (
        <DataTable
          result={result}
          progressData={progressData}
          totalDomainsCount={domains.totalDomainsCount}
          StartFreshSearch={StartFreshSearch}
        />
      ) : (
        ""
      )}
     {/* results ends  */}

    </div>
  );
}

export default App;
