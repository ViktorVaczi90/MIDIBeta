import React from 'react'
import './Header.scss'
import FlatButton from 'material-ui/FlatButton';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton';

export const HeaderLink = ({label, href}) => (
    <RaisedButton label={label} fullWidth={false} onClick={()=>browserHistory.push(href)} primary={href !== browserHistory.getCurrentLocation().pathname} secondary={href === browserHistory.getCurrentLocation().pathname}/>
)

export default HeaderLink
