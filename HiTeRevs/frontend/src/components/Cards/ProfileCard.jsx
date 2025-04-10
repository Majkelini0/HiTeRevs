import './ProfileCard.css'
import { getInitials } from '../../utils/helper.js'
import { Link } from 'react-router-dom'

const ProfileCard = ({ userInfo, onLogout }) => {

    function handleClick(event) {
        event.target.blur()
    }

    return userInfo ? (
       <div className={'profile-card'}>
          <Link to={'/HTRevs/Account'}>
             <p>{getInitials(userInfo?.fullName)}</p>
          </Link>

          <div>
             <button className={'default-button'} onClick={onLogout}>
                Logout
             </button>
          </div>
       </div>
    ) : (
       <div className={'profile-card'}>
          <div>
             <button className={'default-button'} onClick={onLogout}>
                guest
             </button>
          </div>
       </div>
    )
}

export default ProfileCard
