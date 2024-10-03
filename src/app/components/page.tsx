"use client";

import React, { useState } from 'react';
import Button from '@components/controls/Button';
import styles from './components.module.css';
import { HiShoppingBag, HiArrowRight } from 'react-icons/hi';

export default function Components() {
    const [loading, setLoading] = useState(false);

    const handleLoadingClick = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 3000);
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>H1: Lorem Ipsum Dolor</h1>
            <h2>H2: Lorem Ipsum Dolor</h2>
            <h3>H3: Lorem Ipsum Dolor</h3>
            <h4>H4: Lorem Ipsum Dolor</h4>
            <h5>H5: Lorem Ipsum Dolor</h5>
            <h6>H6: Lorem Ipsum Dolor</h6>
            <p>Base: Lorem Ipsum Dolor</p>
            <p className='font-size--sm'>sm: Lorem Ipsum Dolor</p>
            <p className='font-size--xs'>xs: Lorem Ipsum Dolor</p>

            <p style={{ fontWeight: 'bold', paddingTop: '100px' }}>Button Variants</p>
            <div className={styles.section}>
                <Button
                    onClick={() => alert('Primary')}
                >
                    Primary Button
                </Button>
                <Button
                    outline={true}
                    onClick={() => alert('Primary')}
                >
                    Primary Button
                </Button>
            </div>
            <div className={styles.section}>
                <Button
                    style="secondary"
                    onClick={() => alert('Primary')}
                >
                    Secondary Button
                </Button>
                <Button
                    style="secondary"
                    outline={true}
                    onClick={() => alert('Primary')}
                >
                    Secondary Button
                </Button>
            </div>
            <div className={styles.section}>
                <Button
                    style="dark"
                    onClick={() => alert('Primary')}
                >
                    Dark Button
                </Button>
                <Button
                    style="dark"
                    outline={true}
                    onClick={() => alert('Primary')}
                >
                    Dark Button
                </Button>
            </div>
            <div className={`${styles.section} ${styles.bgDark}`}>
                <Button
                    style="light"
                    onClick={() => alert('Primary')}>
                    Light Button
                </Button>
                <Button
                    style="light"
                    outline={true}
                    onClick={() => alert('Primary')}
                >
                    Light Button
                </Button>
            </div>

            <p style={{ fontWeight: 'bold' }}>Buttons with Icons</p>
            <div className={styles.section}>
                <Button
                    onClick={() => alert('Icon Right')}
                    icon={<HiArrowRight />}
                    iconPosition="right"
                >
                    View More
                </Button>
                <Button
                    onClick={() => alert('Icon Left')}
                    icon={<HiShoppingBag />}
                    iconPosition="left"
                >
                    Buy Now
                </Button>
            </div>


            <p style={{ fontWeight: 'bold' }}>Buttons with Loader (click me)</p>
            <div className={styles.section}>
                <Button
                    loading={loading}
                    onClick={handleLoadingClick}
                    icon={<HiArrowRight />}
                    iconPosition="right"
                >
                    View More
                </Button>
                <Button
                    loading={loading}
                    onClick={handleLoadingClick}
                    icon={<HiShoppingBag />}
                    iconPosition="left"
                >
                    Buy Now
                </Button>
                <Button
                    loading={loading}
                    onClick={handleLoadingClick}
                >
                    Buy Now
                </Button>
            </div>
            <p style={{ fontWeight: 'bold' }}>Global Disabled Buttons</p>
            <div className={styles.section}>
            <Button
                onClick={handleLoadingClick}
                style="primary"
                disabled
            >
                Disabled Solid
            </Button>
            <Button
                onClick={handleLoadingClick}
                style="secondary"
                outline={true}
                disabled
            >
                Disabled Outline
            </Button>
            </div>
        </div>
    );
}
