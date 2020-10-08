import React from 'react'
import classnames from 'classnames'

import telegramLogo from 'assets/images/telegram_logo.svg'
import s from './About.module.scss'

const About = props => {
    const { className } = props
    const cx = classnames(s.container, className)

    return (
        <div className={cx}>
            <div className="about flex-1">About text</div>
            <div className="contact">
                <p>Contact Us</p>
                <img
                    src={telegramLogo}
                    className="img-fluid"
                    alt="Telegram group"
                />
            </div>
        </div>
    )
}

export default About
