import { useState } from "react";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { Link, useNavigate } from "react-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase.config";
import { toast } from "react-toastify";
import { OAuth } from "../components/OAuth";

export const SignIn = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const {email, password} = formData;

	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
	}

	const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const auth = getAuth(app);

			const userCredential = await signInWithEmailAndPassword(auth, email, password);
	
			if(userCredential.user) {
				navigate('/')
			}
		} catch {
			toast.error('Bad User Credentials')
		}
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
					<form onSubmit={onSubmit}>
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

						<div className="signInBar">
							<p className="signInText">Sign In</p>
							<button type="submit" className="signInButton">
								<ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to='/sign-up' className="registerLink">Sign Up Instead</Link>

				{/*</main>*/}
			</div>
		</>
	)
}
