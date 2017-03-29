import React from 'react'
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import './Header.scss'
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import HeaderLink from './HeaderLink'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
export const Header = () => (
    <div>
        <Toolbar style={baseTheme}>
            <ToolbarGroup firstChild={true}>
                <HeaderLink label="Home" href="/"/>
                <HeaderLink label="Tuner" href="/tuner" />
                <HeaderLink label="About" href="/about" />
                {console.log(browserHistory)}
            </ToolbarGroup>
        </Toolbar>
    </div>
)

export default Header
