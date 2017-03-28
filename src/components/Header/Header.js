import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';


export const Header = () => (
  <div>
      <AppBar
      title="Guitar learner zeta">
          <FlatButton label="Main" href="/" />
          <FlatButton label="Tuner" href="tunner" />
          <FlatButton label="About" href="about" />
      </AppBar>

{/*    /!*<IndexLink to='/' activeClassName='route--active'>*!/
      /!*Home*!/
    /!*</IndexLink>*!/
    {' · '}
/!*    <Link to='/counter' activeClassName='route--active'>
      Counter
    </Link>*!/*/}

  </div>
)

export default Header
