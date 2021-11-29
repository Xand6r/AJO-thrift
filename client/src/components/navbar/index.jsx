import React from 'react';
import Logo from '../../assets/logo.svg';
import styles from './navbar.module.scss';

export default function Index() {
    return (
        <nav className={styles.header}>
            {/* logo on big screens */}
            <div className={styles.header__logo__big}>
                <img alt="logo" src={Logo}/>
            </div>
            {/* logo on small screens */}
            <div className={styles.header__logo__small}>
                <img alt="logo" src={Logo}/>
            </div>
        </nav>
    )
}
