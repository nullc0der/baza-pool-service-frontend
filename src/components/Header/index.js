import React from 'react'
import classnames from 'classnames'
import { Link, NavLink } from 'react-router-dom'

import poolServiceLogo from 'assets/images/logo.svg'
import s from './Header.module.scss'

const MENU_ITEMS = [
    {
        name: 'Vote',
        link: '/vote',
    },
    {
        name: 'About',
        link: '/about',
    },
]

class Header extends React.Component {
    render() {
        const { className } = this.props
        const cx = classnames(s.container, className)

        return (
            <div className={cx}>
                <div className="logo-wrapper">
                    <Link to="/">
                        <img
                            src={poolServiceLogo}
                            className="img-fluid"
                            alt="Pool Service Logo"
                        />
                        <span>Baza Pool Service</span>
                    </Link>
                </div>
                <div className="flex-1" />
                <div className="menus">
                    {MENU_ITEMS.map((x, i) => (
                        <NavLink
                            to={x.link}
                            key={i}
                            className="menu"
                            activeClassName="active">
                            {x.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        )
    }
}

export default Header
