export const validateLoginLength = (login) => {
    return !(login.length < 5 || login.length > 20)
}

export const validateLogin = (login) => {
    return !login.includes(' ')
}

export const validatePasswordLength = (password) => {
    return !(password.length < 5 || password.length > 50)
}

export const validatePassword = (password) => {
    return !password.includes(' ')
}

export const validateFullName = (fullName) => {
    return !(fullName.split(' ').filter((word) => /^[a-zA-Z]+$/.test(word)).length < 2 )
}

export const validateFullNameLength = (fullName) => {
    return fullName.length <= 50
}

export const getInitials = (name) => {
    if (!name) {
        return ''
    }
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
}
