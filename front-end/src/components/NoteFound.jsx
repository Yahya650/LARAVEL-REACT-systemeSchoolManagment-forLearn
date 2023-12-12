import React from 'react'
import { Link } from 'react-router-dom'

const NoteFound = () => {
  return (
    <div className='container'>
      <h1>404 - Note Found</h1>
      <Link to={'/'}>Go Back</Link>
    </div>
  )
}

export default NoteFound
