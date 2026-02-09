import React from 'react'
import Navbar from './Navbar'

const Header = () => {
  return (
    <header className='border-b border-gray-200 fixed z-[1] w-full '>
      {/* navbar */}
      <Navbar/>
    </header>
  )
}

export default Header
