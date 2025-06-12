import styles from './Register.module.scss';
import Link from 'next/link';

const RegisterView = () => {
    return (
        <div className={styles.register}>
            <div className={styles.register__form}>
                <h1 className={styles.register__form__head}>New Here?</h1>
                <p className={styles.register__form__title}>Sign up your account</p>
                <form action="">
                    <div className={styles.register__form__item}>
                        <label htmlFor="fullname">Username</label>
                        <input type="text" className={styles.register__form__item__input} placeholder='Username'/>                        
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="email">Email</label>
                        <input type="email" className={styles.register__form__item__input} placeholder='Email'/>                        
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className={styles.register__form__item__input} placeholder='Password'/>                        
                    </div>
                    <button className={styles.register__form__button}>Register</button>
                </form>
                <p className={styles.register__link}>
                    Have an account? Sign in <Link href="/auth/login">here</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterView;
