import React, { createContext, useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";



const Context = createContext()
const ContextProvider = ({ children }) => {
  const api = 'https://freewatch.watch/api'
  const navigate = useNavigate();
  const [data,setData] = useState([]);
  const [sortingData,setSortingData] = useState([])
  const [byYear,setByYear] = useState();
  const [byJanr,setByJanr] = useState();
  const [active, setActive] = useState(false);
  const newData = sortingData.length ? sortingData : data;

  const GetData = async() =>{
    try {
       const res = await axios.get(`${api}/film`);
       setData(res.data)
    } catch (error) {
        console.log(error.message);
    }
  }
  useEffect(() =>{
    GetData()
  },[api]);
  

  const Filter = async() =>{
    try {        
      if(byJanr && !byYear) {
        const obj = data.filter((el) => el.janr === byJanr);      
        setSortingData(obj)
      } 
      else if(byYear && !byJanr){
        const obj = data.filter((el) => el.yil === byYear);      
        setSortingData(obj)
      }
      else{
        const obj = data.filter((el) => el.janr === byJanr && el.yil === byYear);      
        setSortingData(obj)
      }
    } catch (error) {
      console.log(error.message);
      
    }
  }


  return (
    <Context.Provider value={{
      active, setActive, navigate,data,api,Filter,sortingData,setByYear,setByJanr,newData
    }}>
      {children}
    </Context.Provider>
  )
}
export { Context, ContextProvider }