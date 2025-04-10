import { Link, useNavigate } from 'react-router-dom'
import ProfileCard from '../Cards/ProfileCard.jsx'
import '../ThemeButton/ThemeButton.jsx'
import './Navbar.css'
import ThemeButton from '../ThemeButton/ThemeButton.jsx'

const Navbar = ({ userInfo }) => {
   const navigate = useNavigate()

   const onLogout = (event) => {
      event.target.blur()
      localStorage.removeItem('token')
      navigate('/HTRevs/Login')
   }

   return (
      <div className={'navbar'}>
         <ProfileCard userInfo={userInfo} onLogout={onLogout} />

         {!userInfo ? (
            <h2>
               <Link to={'/HTRevs/Login'}>Login</Link>
            </h2>
         ) : (
            <h2>
               <Link to={'/HTRevs/AddReview'}>Add</Link>
            </h2>
         )}

         <h1>
            <Link to={'/HTRevs'}>HiTeRevs</Link>
         </h1>
         <h2>
            <Link to={'/HTRevs/Register'}>Register</Link>
         </h2>

         <ThemeButton />
      </div>
   )
}

export default Navbar
