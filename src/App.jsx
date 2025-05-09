/* eslint-disable no-unused-vars */
import React from "react";
import {
	Routes,
	Route
} from 'react-router-dom'
import Header from "./Components/Header";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Foods from "./Components/Foods";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import About from "./Components/About";
import ContactUs from "./Components/ContactUs";
import Profile from "./Components/Profile";
import Setting from "./Components/Setting";
import UserState from './users/userState'

function App() {
	return (
		<>
			<UserState>
				<Header />
				<Routes>
					<Route exact path='/' element={<Home />}></Route>
					<Route exact path='/login' element={<Login />}></Route>
					<Route exact path='/signup' element={<Signup />}></Route>
					<Route exact path='/foods' element={<Foods />}></Route>
					<Route exact path='/aboutus' element={<About />}></Route>
					<Route exact path='/contactus' element={<ContactUs />}></Route>
					<Route exact path='/profile' element={<Profile />}></Route>
					<Route exact path='/setting' element={<Setting />}></Route>
				</Routes>
				<Footer />
			</UserState>
		</>
	);
}

export default App;
