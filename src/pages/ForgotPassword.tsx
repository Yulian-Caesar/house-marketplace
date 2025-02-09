import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "../firebase.config.ts";
import ArrowRightIcon from "../assets/svg/keyboardArrowRightIcon.svg?react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

export const ForgotPassword = () => {
	const [email, setEmail] = useState('');

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value)
	}

	const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			const auth = getAuth(app);
			await sendPasswordResetEmail(auth, email)
			toast.success('Email was sent')
		} catch {
			toast.error('Could not send reset email')
		}
	}

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Forgot Password</p>
			</header>

			<main>
				<form onSubmit={onSubmit}>
					<input 
						type="email"
						id="email"
						className="emailInput"
						placeholder="Email"
						value={email}
						onChange={onChange}
					/>
					<Link to='/sign-in' className="forgotPasswordLink">Sign In</Link>

					<div className="signInBar">
						<div className="signInText">Send Reset Link</div>
						<button className="signInButton">
							<ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
						</button>
					</div>
				</form>
			</main>
		</div>
	)
}
