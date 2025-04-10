import React, { useState } from 'react'

const PasswordInput = ({ value, onChange, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <input
            value={value}
            onChange={onChange}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder || 'Password'}
            className={'basic-input'}
        />
    )
}

export default PasswordInput