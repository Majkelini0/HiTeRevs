import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import PasswordInput from '../../components/Input/PasswordInput.jsx'
import { Link, useNavigate } from 'react-router-dom'
import {
   validateFullName, validateFullNameLength,
   validateLogin, validateLoginLength,
   validatePassword, validatePasswordLength,
} from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosinstance.js'

const Register = () => {
   const [fullName, setFullName] = useState('')
   const [login, setLogin] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState(null)
   const navigate = useNavigate()

   const handleRegister = async (e) => {
      e.preventDefault()
      if (!fullName) {
         setError('Full name is required')
      }
      if (!validateFullName(fullName)) {
         setError('Full name must contain at least 2 words')
         return
      }
      if(!validateFullNameLength(fullName)) {
            setError('Full name must not exceed 50 characters')
            return
      }
      if (!validateLogin(login)) {
         setError('Login must not contain spaces')
         return
      }
      if (!validateLoginLength(login)) {
         setError('Login must be between 5 and 20 characters')
         return
      }
      if (!validatePassword(password)) {
         setError('Password must not contain spaces')
         return
      }
      if (!validatePasswordLength(password)) {
         setError('Password must be between 5 and 50 characters')
         return
      }
      setError('')

      try {
         const response = await axiosInstance.post('/HTRevs/register', {
            fullName: fullName,
            login: login,
            password: password,
         })

         if (response.data && response.data.error) {
            setError(response.data.error)
            return
         }

         if (response.data && response.data.accessToken) {
            localStorage.removeItem('token')
            localStorage.setItem('token', response.data.accessToken)
            navigate('/HTRevs')
         }
      } catch (error) {
         if (
            error.response &&
            error.response.data &&
            error.response.data.message
         ) {
            setError(error.response.data.message)
         } else {
            setError('An unexpected error occurred')
         }
      }
   }

   function handleClick(event) {
      event.target.blur()
   }

   return (
      <>
         <Navbar />
         <div className={'basic-inputs-container'}>
            <div>
               <form onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <input
                     type={'text'}
                     placeholder={'full name'}
                     className={'basic-input'}
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                  />

                  <input
                     type={'text'}
                     placeholder={'login'}
                     className={'basic-input'}
                     value={login}
                     onChange={(e) => setLogin(e.target.value)}
                  />
                  <PasswordInput
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />

                  {error && <p>{error}</p>}

                  <button
                     type={'submit'}
                     className={'default-button'}
                     onClick={handleClick}
                  >
                     SignUp
                  </button>

                  <p>
                     Already have an Account ?{' '}
                     <Link to={'/HTRevs/login'} className={''}>
                        Login
                     </Link>
                  </p>
               </form>
            </div>
         </div>
      </>
   )
}

export default Register
