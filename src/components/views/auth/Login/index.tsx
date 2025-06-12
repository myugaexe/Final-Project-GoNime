import styles from './Login.module.scss';
import Link from 'next/link';

const LoginView = () => {
    return (
        <div className={styles.login}>
            <div className={styles.login__form}>
                <h1 className={styles.login__form__head}>Welcome!</h1>
                <p className={styles.login__form__title}>Sign in your account</p>
                <form action="">
                    <div className={styles.login__form__item}>
                        <label htmlFor="email">Email</label>
                        <input type="email" className={styles.login__form__item__input} placeholder='Email'/>                        
                    </div>
                    <div className={styles.login__form__item}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className={styles.login__form__item__input} placeholder='Password'/>                        
                    </div>
                    <button className={styles.login__form__button}>Login</button>
                </form>
                <p className={styles.login__link}>
                    Need an account? Sign up <Link href="/auth/register">here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginView;
