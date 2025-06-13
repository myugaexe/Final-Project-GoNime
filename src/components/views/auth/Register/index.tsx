'use client';

import styles from './Register.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { z }  from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SignUpSchema = z
  .object({
    username: z.string().min(3, "Username too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password too short"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignUpForm = z.infer<typeof SignUpSchema>;

const RegisterView = () => {
    const router = useRouter();
    const [form, setForm] = useState<SignUpForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = SignUpSchema.safeParse(form);
        if (!result.success) {
            const firstError = result.error.errors[0]?.message || "Invalid input";
            setError(firstError);
            return;
        }

        setError(null);

        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: form.username,
                email: form.email,
                password: form.password,
            }),
        });

        if (response.ok) {
        router.push('/auth/login');
        } else {
        setError('Failed to create user.');
        console.error('Failed to create user:', response.statusText);
        }
    };

    return (
        <div className={styles.register}>
            <div className={styles.register__form}>
                <h1 className={styles.register__form__head}>New Here?</h1>
                <p className={styles.register__form__title}>Sign up your account</p>
                <div className={styles.register__form__logo}>
                <Image src="/testImage.png" alt="Logo" width={100} height={100} />
                </div>
                <form onSubmit={onSubmit} action="">
                    <div className={styles.register__form__item}>
                        <label htmlFor="fullname">Username</label>
                        <input 
                            type="text" 
                            className={styles.register__form__item__input} 
                            placeholder='Username'
                            value={form.username}
                            onChange={(e) => setForm({ ...form, username: e.target.value })}
                            required
                            />                        
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            className={styles.register__form__item__input} 
                            placeholder='Email'
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}   
                            required
                            />                        
                    </div>
                    <div className={styles.register__form__item}>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            className={styles.register__form__item__input} 
                            placeholder='Password'
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />                        
                    </div>
                     <div className={styles.register__form__item}>
                        <label htmlFor="password">Confirm Password</label>
                        <input 
                            type="password" 
                            className={styles.register__form__item__input} 
                            placeholder='Confirm Password'
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />                        
                    </div>
                    {error && <p className={styles.register__form__item__input__errorMessage}>{error}</p>}
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
