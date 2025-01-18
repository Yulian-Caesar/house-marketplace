import { useState } from "react";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { Link, useNavigate } from "react-router";

export const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: ''
	})
	const { name, email, password} = formData;

	const navigate = useNavigate();

	const onChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
	}

	return (
		<>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">
						Welcome Back
					</p>
				</header>

				{/*<main>*/}
					<form>
						<input 
							type="text" 
							placeholder="Name" 
							className="nameInput" 
							id="name" 
							value={name} 
							onChange={onChange}
						/>

						<input 
							type="email" 
							placeholder="Email" 
							className="emailInput" 
							id="email" 
							value={email} 
							onChange={onChange}
						/>

						<div className="passwordInputDiv">
							<input 
								type={showPassword ? 'text' : 'password'}
								className="passwordInput"
								placeholder="Password"
								id="password"
								value={password}
								onChange={onChange}
							/>
							
							<img 
								src={visibilityIcon} 
								alt="show password"
								className="showPassword"
								onClick={() => setShowPassword((prevState) => !prevState)}
							/>
						</div>
						<Link to='/forgot-password' className="forgotPasswordLink">
							Forgot Password
						</Link>

						<div className="signUpBar">
							<p className="signUpText">Sign Up</p>
							<button className="signUpButton">
								<ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					{/* Google oauth component */}

					<Link to='/sign-in' className="registerLink">Sign In Instead</Link>

				{/*</main>*/}
			</div>
		</>
	)
}
