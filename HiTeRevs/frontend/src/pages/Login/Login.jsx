import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar.jsx'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInput from '../../components/Input/PasswordInput.jsx'
import { validateLogin, validatePassword } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosinstance.js'

const Login = () => {
   const [login, setLogin] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState(null)

   const navigate = useNavigate()

   const handleLogin = async (e) => {
      e.preventDefault()
      if (!validateLogin(login)) {
         setError('Login must be between 5 and 20 characters')
         return
      }
      if (!validatePassword(password)) {
         setError('Password must be between 5 and 50 characters')
         return
      }
      setError('')

      try {
         const response = await axiosInstance.post('/HTRevs/login', {
            login: login,
            password: password,
         })
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
      event.target.blur();
   }

   return (
      <>
         <Navbar/>
         <div className={'basic-inputs-container'}>
            <div className={''}>
               <form onSubmit={handleLogin}>
                  <h1>Login</h1>
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

                  <button type={'submit'} className={'default-button'} onClick={handleClick}>
                     Login
                  </button>

                  <p>
                     Not registered yet ?{' '}
                     <Link to={'/HTRevs/register'} className={''}>
                        Create an Account
                     </Link>
                  </p>
               </form>
            </div>
         </div>
      </>
   )
}

export default Login
