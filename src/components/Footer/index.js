import React from 'react'
import classnames from 'classnames'

import s from './Footer.module.scss'

const Footer = props => {
    const { className } = props
    const cx = classnames(s.container, className)

    return (
        <div className={cx}>
            <span>&copy; Baza Foundation 2020 - 2025</span>
        </div>
    )
}

export default Footer
