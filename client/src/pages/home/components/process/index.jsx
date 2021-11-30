import React from 'react';
import {
    Nature,
    Formulation,
    Science,
    Beauty
} from './assets';
import styles from './process.module.scss';

export default function Index() {
    return (
        <section className={styles.process}>
            <div className={styles.process__header}>
                <p>OUR PROCESS</p>
                <h2>
                    Inspired by peers, driven by funds
                </h2>
            </div>

            <div className={styles.process__tabcontent}>
                <div className={styles.tab__group}>
                    <Tab
                        ImageItem={Nature}
                        heading="Inspired by decentralisation"
                        text="Start by connecting your metamask wallet, then creating a cooperative on this page and specifying several characteristics of the cooperative."
                    />
                    <div className={styles.vertical__line} />
                    <Tab
                        ImageItem={Formulation}
                        heading="Driven by peers"
                        text="The next step is to invite peers to your cooperative, participation is by invitation only and each member is entitled to only one invitation. so when you invite one account, that account can invite another account, and so on, until limit is reached and the funds pooling can start"
                    />
                </div>
                <div className={styles.horizontal__line} />
                <div className={styles.tab__group}>
                    <Tab
                        ImageItem={Beauty}
                        heading="Facilitated by funds"
                        text="After the cooperative has reached its member limit, it is then kicked off and one random member is assigned a 'claimer' status. Everyone except the claimer named 'depositors' makes a deposit within the specified time period."
                    />
                    <div className={styles.vertical__line} />
                    <Tab
                        ImageItem={Science}
                        heading="Completed by claiming"
                        text="When all 'depositors' have made a deposit, the 'claimer' then claims all the funds in the pool, a new 'claimer' is assigned and then we repeat step 3, until every member have attained 'claimer' status and the cooperative is marked as closed."
                    />
                </div>
            </div>
        </section>
    )
}


function Tab({heading, text, ImageItem}){
    return (
        <section className={styles.process__tab}>
            <ImageItem/>
            <div className={styles.process__tab__text}>
                <h3>{heading}</h3>
                <p>
                    {text}
                </p>
            </div>
        </section>
    );
}