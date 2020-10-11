import React from 'react'
import classnames from 'classnames'

import telegramLogo from 'assets/images/telegram_logo.svg'
import s from './About.module.scss'

const About = props => {
    const { className } = props
    const cx = classnames(s.container, className)

    return (
        <div className={cx}>
            <div className="about">
                <p>
                    Baza Services was built to focus on providing the services
                    for the crypto space in order to create utility and value
                    for the Baza token. The developers of Baza Foundation
                    created Baza Services to further its mission by building
                    profitable crpyto services for the crypto space. Baza
                    Services will be focused by build voting governance for its
                    enhancements and features with each new roll out. The first
                    roll out launch in this release is a pool services that
                    allows you to vote with Baza tokens. New pools will be added
                    based on the winner in each voting round. As Baza demand
                    increases in utility so will its value, and the plan will be
                    to channel a percentage of profit made by these new services
                    towards the Baza Foundation and its mission.
                </p>
                <p>
                    If you have any questions, wish to know more, of follow
                    please join the telegram channel.
                </p>
            </div>
            <div className="contact">
                <p>Contact Us</p>
                <a
                    href="http://t.me/bazafoundation"
                    target="_blank"
                    rel="noopener noreferrer">
                    <img
                        src={telegramLogo}
                        className="img-fluid"
                        alt="Telegram group"
                    />
                </a>
            </div>
        </div>
    )
}

export default About
