import React, { useState } from "react";
import signup from "../assest/signup.webp";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ImagetoBase64 } from "../utility/ImagetoBase64";
import toast, { Toaster } from 'react-hot-toast';

const Singup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState();
  const [showConfirmPassword, setShowConfirmPassword] = useState();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  

  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((preve) => !preve);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async(e)=>{
    
    e.preventDefault()
    const {firstName , email , password , confirmPassword} = data
    if(firstName && email && password && confirmPassword){
      if(password === confirmPassword){
        
        const fetchData = await fetch("http://localhost:8080/signup",{
          method : "POST", 
            headers : {
              "content-type" : "application/json"
            },
            body : JSON.stringify(data)
        })

         const dataRes = await fetchData.json()
         
        toast(dataRes.message)
        if(dataRes.status){
          navigate("/login")
        }
        
      }else{
        alert("password & confirmpassword not matched")
      }
    }else{
      alert("please enter require field")
    }
  }

  const handleUploadProfileImage = async(e)=>{
    const data = await ImagetoBase64(e.target.files[0])

    setData((preve)=>{
        return{
          ...preve,
          image : data
        }
    })

}

  return (
    <div className="p-3 md:p-4">
      <div className="w-full max-w-sm bg-white m-auto flex  flex-col p-4 ">
        {/* <h1 className=" text-center text-2xl font-bold "> Singup</h1> */}

        <div className="w-20 h-20 overflow-hidden rounded-full drop-shadow-md shadow-md m-auto relative">
          <img src={data.image ? data.image : signup} className="w-full h-full" />

          <label htmlFor="profileImage">
          <div className="absolute bottom-0 h-1/3  bg-slate-700 bg-opacity-50 w-full text-center cursor-pointer">
            <p className="text-sm p-1 text-white">Upload</p>
          </div>
          <input type={"file"} id="profileImage" accept="image/*" className="hidden" onChange={handleUploadProfileImage}/>
          </label>
        </div>

        <form className="w-full py-3 flex flex-col" onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input
            type={"text"}
            id="firstName"
            name="firstName"
            value={data.firstName}
            onChange={handleOnChange}
            className="mt-1 mb-2 w-full bg-slate-200 px-1 py-1 rounded focus-within:outline-blue-500"
          ></input>

          <label htmlFor="LastName">Last Name</label>
          <input
            type={"text"}
            id="lastName"
            name="lastName"
            value={data.lastName}
            onChange={handleOnChange}
            className="mt-1 mb-2 w-full bg-slate-200 px-1 py-1 rounded focus-within:outline-blue-500"
          ></input>

          <label htmlFor="email">Email</label>
          <input
            type={"email"}
            id="email"
            name="email"
            value={data.email}
            onChange={handleOnChange}
            className="mt-1 mb-2 w-full bg-slate-200 px-1 py-1  rounded focus-within:outline-blue-500"
          ></input>

          <label htmlFor="password">Password</label>
          <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2 focus-within:outline focus-within:outline-blue-300">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={data.password}
              onChange={handleOnChange}
              className=" w-full bg-slate-200 border-none outline-none "
            ></input>
            <span
              className="flex text-xl cursor-pointer mt-2"
              onClick={handleShowPassword}
            >
              {" "}
              {showPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <label htmlFor="confirmpassword">Confirm Password</label>
          <div className="flex px-2 py-1 bg-slate-200 rounded mt-1 mb-2  focus-within:outline focus-within:outline-blue-300">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmpassword"
              name="confirmPassword"
              className=" w-full bg-slate-200 border-none outline-none "
              value={data.confirmPassword}
              onChange={handleOnChange}
            />
            <span
              className="flex text-xl cursor-pointer"
              onClick={handleShowConfirmPassword}
            >
              {showConfirmPassword ? <BiShow /> : <BiHide />}
            </span>
          </div>

          <button type="submit" className="w-full max-w-[150px] m-auto  bg-red-500 hover:bg-red-600 cursor-pointer  text-white text-xl font-medium text-center py-1 rounded-full mt-4">
            Signup
          </button>
        </form>
        <p className="text-left text-sm mt-2">
          Already Have Account?{" "}
          <Link to={"/login"} className="text-red-500 underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Singup;
