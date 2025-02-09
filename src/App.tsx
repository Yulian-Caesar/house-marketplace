import { BrowserRouter, Routes, Route } from "react-router"
import { Explore as ExplorePage } from "./pages/Explore"
import { ForgotPassword as ForgotPasswordPage } from "./pages/ForgotPassword"
import { Offers as OffersPage } from "./pages/Offers"
import { Profile as ProfilePage } from "./pages/Profile"
import { SignIn as SignInPage } from "./pages/SignIn"
import { SignUp as SignUpPage } from "./pages/SignUp"
import { Navbar } from "./components/Navbar"
import { ToastContainer } from "react-toastify"
import { PrivateRoute } from "./components/PrivateRoute"
import { Category as CategoryPage } from "./pages/Category"
import { CreateListing as CreateListingPage } from "./pages/CreateListing"
import { EditListing as EditListingPage } from "./pages/EditListing"
import { Listing as ListingPage } from "./pages/Listing"
import { Contact as ContactPage } from "./pages/Contact"

function App() {

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<ExplorePage />} />
					<Route path="/offers" element={<OffersPage />} />
					<Route path="/category/:categoryName" element={<CategoryPage />} />
					<Route path="/profile" element={<PrivateRoute />}>
						<Route path="/profile" element={<ProfilePage />} />
					</Route>
					<Route path="/sign-in" element={<SignInPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/create-listing" element={<CreateListingPage />} />
					<Route path="/edit-listing/:listingId" element={<EditListingPage />} />
					<Route path='/category/:categoryName/:listingId' element={<ListingPage />} />
					<Route path="/contact/:landlordId" element={<ContactPage />} />
				</Routes>
				<Navbar />
			</BrowserRouter>
			<ToastContainer />
		</>
	)
}

export default App
