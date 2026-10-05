// import React from 'react'

// const Header = () => {
//   return (
//     <h2>
//       Expense Tracker
//     </h2>
//   )
// }

// export default Header;


import React from 'react'

const Header = () => {
  return (
    <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <svg width="44" height="44" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="2" y="2" width="60" height="60" rx="16" fill="#FFD23F" stroke="#2B2350" strokeWidth="4" />
        <circle cx="32" cy="32" r="17" fill="#FF6B9D" stroke="#2B2350" strokeWidth="4" />
        <text x="32" y="40" textAnchor="middle" fontWeight="900" fontSize="24" fill="#2B2350">$</text>
      </svg>
      Expense Tracker
    </h2>
  )
}

export default Header;