/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import {
	Routes,
	Route
} from 'react-router-dom'
import Header from "./Components/Header";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Foods from "./Components/Foods";
import FoodDetail from "./Components/FoodDetail";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import About from "./Components/About";
import ContactUs from "./Components/ContactUs";
import Profile from "./Components/Profile";
import Setting from "./Components/Setting";
import UserState from './Context/users/userState'
import Order from "./Components/Order";
import Alert from "./Components/Alert";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import ThemeContext from "./Context/Theme/ThemeContext";

function App() {
	const [eyeicon, seteyeicon] = useState("fa-eye-slash");
	const [inputType, setInputType] = useState('password');
	const change = () => {
		if (eyeicon === "fa-eye-slash") {
			seteyeicon("fa-eye");
			setInputType("text");
		}
		if (eyeicon === "fa-eye") {
			seteyeicon("fa-eye-slash");
			setInputType("password");
		}
	}

	const context = useContext(ThemeContext);
	const { theme } = context;

	return (
		<>
			<UserState>
				<div className={`transition-[background] ease-linear duration-300 ${theme === 'dark' ? 'bg-[#060922] brightness-90 text-white min-h-screen' : 'bg-transparent text-black min-h-screen'}`}>
					<Header />
					<Routes>
						<Route exact path='/' element={<Home />}></Route>
						<Route exact path='/login' element={<Login inputType={inputType} eyeicon={eyeicon} change={change} />}></Route>
						<Route exact path='/signup' element={<Signup inputType={inputType} eyeicon={eyeicon} change={change} />}></Route>
						<Route exact path='/foods' element={<Foods />}></Route>
						<Route exact path='/food/:id' element={<FoodDetail />}></Route>
						<Route exact path='/aboutus' element={<About />}></Route>
						<Route exact path='/contactus' element={<ContactUs />}></Route>
						<Route exact path='/profile' element={<Profile />}></Route>
						<Route exact path='/order' element={<Order />}></Route>
						<Route path="/forgot-password" element={<ForgotPassword />} />
						<Route path="/reset-password" element={<ResetPassword />} />
						<Route exact path='/setting' element={<Setting inputType={inputType} eyeicon={eyeicon} change={change} />}></Route>
					</Routes>
					<Alert />
					<Footer />
				</div>
			</UserState>
		</>
	);
}

export default App;
