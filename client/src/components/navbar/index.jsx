import React from 'react';
import styles from './navbar.module.scss';

export default function Index() {
    return (
        <nav className={styles.header}>
            {/* logo on big screens */}
            <div className={styles.header__logo__big}>
                <h2>THE COOPERATIVE</h2>
            </div>
            {/* logo on small screens */}
            <div className={styles.header__logo__small}>
                <h4>THE COOPERATIVE</h4>
            </div>
        </nav>
    )
}
