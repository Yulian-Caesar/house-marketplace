import { BrowserRouter as Router, Routes, Route } from "react-router"
import { Explore as ExplorePage } from "./pages/Explore"
import { ForgotPassword as ForgotPasswordPage } from "./pages/ForgotPassword"
import { Offers as OffersPage } from "./pages/Offers"
import { Profile as ProfilePage } from "./pages/Profile"
import { SignIn as SignInPage } from "./pages/SignIn"
import { SignUp as SignUpPage } from "./pages/SignUp"
import { Navbar } from "./components/Navbar"

function App() {

	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<ExplorePage />} />
					<Route path="/offers" element={<OffersPage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
				</Routes>
				<Navbar />
			</Router>
		</>
	)
}

export default App
