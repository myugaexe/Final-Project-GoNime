'use client';

import styles from './Login.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { z } from 'zod';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInForm = z.infer<typeof SignInSchema>;

const LoginView = () => {
    const router = useRouter();
    const [form, setForm] = useState<SignInForm>({
        email: '',
        password: ''
    });

    const [error, setErrors] = useState<string | null>(null);
    
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = SignInSchema.safeParse(form);
        if (!result.success) {
            const firstError = result.error.errors[0]?.message || "Invalid input";
            setErrors(firstError);
            return;
        }

        setErrors(null);

        const SignInData = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false
        });

        if (SignInData?.error) {
            setErrors("Invalid email or password");
        } 
        else {
            router.refresh();
            router.push('/pages/greeting');
        }
    }

    return (
        <div className={styles.login}>
            <div className={styles.login__form}>
                <h1 className={styles.login__form__head}>Welcome!</h1>
                <p className={styles.login__form__title}>Sign in your account</p>
                <div className={styles.login__form__logo}>
                <Image src="/testImage.png" alt="Logo" width={100} height={100} />
                </div>
                <form onSubmit={onSubmit} action="">
                    <div className={styles.login__form__item}>
                        <label htmlFor="email">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            className={styles.login__form__item__input} 
                            placeholder='Email' 
                            value={form.email} 
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />                        
                    </div>
                    <div className={styles.login__form__item}>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            className={styles.login__form__item__input} 
                            placeholder='Password'
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />                        
                    </div>
                    {error && <p className="text-red-600 text-sm mt-2">{error}</p>} 
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
