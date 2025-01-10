import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { CarDataContext } from './CarDataContext';

function Logout() {

    const navigate = useNavigate()

    const {logout} = useContext(CarDataContext)

    const handleLogout = () => {
        logout()
        navigate('/')
    }

  return (
    <>
      <button className='btn btn-primary' onClick={() => handleLogout()}>Logout</button>
    </>
  )
}

export default Logout
