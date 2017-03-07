import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import AppBar from 'material-ui/AppBar';

export const Header = () => (
  <div>
    <AppBar
      title="Guitar learner zeta"
      iconClassNameRight="muidocs-icon-navigation-expand-more"
    />
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
