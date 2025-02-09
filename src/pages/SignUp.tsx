import { useState } from "react";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import { Link, useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, FieldValue, serverTimestamp } from "firebase/firestore";
import { app, db } from "../firebase.config.ts";
import { toast } from "react-toastify";
import { OAuth } from "../components/OAuth";

export type FormDataType = {
	name: string,
	email: string,
	password?: string,
	timestamp?: FieldValue
}

export const SignUp = () => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState<FormDataType>({
		name: '',
		email: '',
		password: ''
	})
	const { name, email, password} = formData;

	const navigate = useNavigate();

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value
		}))
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if(!password) return console.error('password is required')
				
			const auth = getAuth(app);
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			if(auth.currentUser) {
				updateProfile(auth.currentUser, {
					displayName: name
				})
			} else {
				return console.error("No user is currently authenticated.");
			}

			const formDataCopy = {...formData};
			delete formDataCopy.password;
			formDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, 'users', user.uid), formDataCopy)

			navigate('/')
		} catch {
			toast.error('Something went wrong with registration')
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
							<button type="submit" className="signUpButton">
								<ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
							</button>
						</div>
					</form>

					<OAuth />

					<Link to='/sign-in' className="registerLink">Sign In Instead</Link>

				{/*</main>*/}
			</div>
		</>
	)
}
