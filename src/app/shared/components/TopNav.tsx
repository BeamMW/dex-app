import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '@app/shared/constants';

export const TopNav = () => (
  <nav style={{
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: '18px 0 10px',
  }}
  >
    <div style={{
      width: '100%',
      maxWidth: 980,
      display: 'flex',
      justifyContent: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    }}
    >
      {[
        { to: ROUTES.NAV.TRADE, label: 'Trade' },
        { to: ROUTES.NAV.EXPLORE, label: 'Explore' },
        { to: ROUTES.NAV.MY, label: 'My' },
      ].map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          style={({ isActive }) => ({
            color: isActive ? 'white' : 'rgba(255, 255, 255, 0.6)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontSize: 13,
            fontWeight: 700,
            padding: '8px 18px',
            borderBottom: isActive ? '2px solid var(--color-green)' : '2px solid transparent',
          })}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);

export default TopNav;
