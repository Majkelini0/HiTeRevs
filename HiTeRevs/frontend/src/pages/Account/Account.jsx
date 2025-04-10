import Navbar from '../../components/Navbar/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '../../utils/axiosinstance.js'
import PasswordInput from '../../components/Input/PasswordInput.jsx'
import {
    validateLogin, validateLoginLength,
    validatePassword, validatePasswordLength,
} from '../../utils/helper.js'
import './Account.css'
import ReviewsList from '../../components/Lists/ReviewsList.jsx'

const Account = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [userReviews, setUserReviews] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const [newFullName, setNewFullName] = useState('')
    const [newLogin, setNewLogin] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')

    const handleClick = (event) => {
        event.target.blur()
    }

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get('/HTRevs/get-user')
            if (response.data) {
                setUserInfo(response.data && response.data.user)
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.clear()
                navigate('/HTRevs/login')
            } else {
                console.error('Error fetching user info:', error)
            }
        }
    }

    const getUserReviews = async () => {
        try {
            const response = await axiosInstance.get(`/HTRevs/account/reviews`)
            if (response.data) {
                setUserReviews(response.data && response.data.reviews)
                console.log(response.data.reviews)
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                console.error(error.response.data.message)
            } else {
                console.error('An unexpected error occurred')
            }
        }
    }

    const handleAccDelete = async (e) => {
        e.preventDefault()
        e.target.blur()
        try {
            const response = await axiosInstance.post('/HTRevs/delete-account')
            if (response.data && response.data.error) {
                setError(response.data.error)
                return
            }
            if (response.data && response.data.message) {
                localStorage.clear()
                navigate('/HTRevs/login')
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

    const handleUpdateAccount = async (e) => {
        e.preventDefault()
        e.target.blur()
        let pass = false
        if (!newFullName) {
            setError('Full name is required')
        }
        if (
            newFullName.split(' ').length < 2 ||
            newFullName.split(' ')[1] === ''
        ) {
            setError('Full name must contain at least 2 words')
            return
        }
        if (!validateLogin(newLogin)) {
            setError('Login must not contain spaces')
            return
        }
        if (!validateLoginLength(newLogin)) {
            setError('Login must be between 5 and 20 characters')
            return
        }
        if (oldPassword !== '' || newPassword !== '' || newPassword2 !== '') {
            pass = true
            if (!validatePassword(oldPassword)) {
                setError('Old password must not contain spaces')
                return
            }
            if (!validatePassword(newPassword)) {
                setError('Password must not contain spaces')
                return
            }
            if (!validatePassword(newPassword2)) {
                setError('Password must not contain spaces')
                return
            }
            if (!validatePasswordLength(newPassword)) {
                setError('Password must be between 5 and 50 characters')
                return
            }
            if (newPassword !== newPassword2) {
                setError('Passwords do not match')
                return
            }
        }
        if(userInfo.fullName === newFullName && userInfo.login === newLogin && !pass){
            setError('No changes were made')
            return
        }
        setError('')

        try {
            const response = await axiosInstance.post(
                '/HTRevs/update-account',
                {
                    fullName: newFullName,
                    login: newLogin,
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    pass: pass,
                }
            )

            if (response.data && response.data.error) {
                setError(response.data.error)
                return
            }

            if (response.data && response.data.message) {
                localStorage.clear()
                navigate('/HTRevs/login')
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

    useEffect(() => {
        const fetchData = async () => {
            await getUserInfo()
            await getUserReviews()
        }
        fetchData().catch((error) =>
            console.error('Error initializing data in useEffect:', error)
        )

        return () => {}
    }, [])

    useEffect(() => {
        if (userInfo) {
            setNewFullName(userInfo.fullName)
            setNewLogin(userInfo.login)
        }
    }, [userInfo])

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className={'account-main'}>
                <div className={'basic-inputs-container'}>
                    <form onSubmit={handleUpdateAccount}>
                        <h1>Account</h1>
                        <input
                            type={'text'}
                            placeholder={'full name'}
                            className={'basic-input'}
                            value={newFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                        />

                        <input
                            type={'text'}
                            placeholder={'login'}
                            className={'basic-input'}
                            value={newLogin}
                            onChange={(e) => setNewLogin(e.target.value)}
                        />

                        <PasswordInput
                            value={oldPassword}
                            placeholder={'Old Password'}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <PasswordInput
                            value={newPassword}
                            placeholder={'New Password'}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <PasswordInput
                            value={newPassword2}
                            placeholder={'Repeat new password'}
                            onChange={(e) => setNewPassword2(e.target.value)}
                        />

                        {error && <p>{error}</p>}

                        <button
                            type={'submit'}
                            className={'default-button'}
                            onClick={handleClick}
                        >
                            Update
                        </button>
                        <button
                            className={'default-button'}
                            id={'delete-account-button'}
                            onClick={handleAccDelete}
                        >
                            Delete Account
                        </button>
                    </form>
                </div>
                <div className={'reviews-container'}>
                    <ReviewsList userInfo={userInfo} reviews={userReviews} />
                </div>
            </div>
        </>
    )
}

export default Account
