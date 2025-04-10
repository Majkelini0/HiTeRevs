import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Account from './pages/Account/Account.jsx'
import AddReview from './pages/Home/AddReview.jsx'
import Product from './pages/Product/Product.jsx'
import Review from './pages/Review/Review.jsx'

const routes = (
    <Router>
        <Routes>
            <Route path="/HTRevs" exact element={<Home/>} />
            <Route path="/HTRevs/login" exact element={<Login/>} />
            <Route path="/HTRevs/register" exact element={<Register/>} />
            <Route path="/HTRevs/account" exact element={<Account/>} />
            <Route path={'/HTRevs/addreview'} exact element={<AddReview/>} />
            <Route path={"/HTRevs/product"} exact element={<Product/>} />
            <Route path={"/HTRevs/reviews"} exact element={<Review/>} />
        </Routes>
    </Router>
)


const App = () => {

    return (
        <div>
            {routes}
        </div>
    )
}

export default App;

