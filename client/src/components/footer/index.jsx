import React from 'react';
import logo from '../../assets/logowhite.svg';
import styles from './footer.module.scss';

export default function Index() {
    return (
        <footer className={styles.footer}>
            <img alt="logo" src={logo}/>
            <h6>
                2021 Springsentia. All rights reserved.
            </h6>
        </footer>
    )
}
