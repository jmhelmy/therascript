"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  MultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/auth";
import styles from "./LoginPage.module.css";

let recaptchaVerifier: RecaptchaVerifier;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [error, setError]                   = useState("");
  const [showMfaPrompt, setShowMfaPrompt]   = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [smsCode, setSmsCode]               = useState("");
  const [resolver, setResolver]             = useState<MultiFactorResolver | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/multi-factor-auth-required") {
        const mfr = err.resolver as MultiFactorResolver;
        setResolver(mfr);
        setShowMfaPrompt(true);
        const phoneInfo = mfr.hints[0];
        if (phoneInfo.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
          const provider = new PhoneAuthProvider(auth);
          if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(
              auth,
              "recaptcha-container",
              { size: "invisible", callback: () => {}, "expired-callback": () => setError("reCAPTCHA expired. Try again.") }
            );
          }
          const id = await provider.verifyPhoneNumber(
            { phoneNumber: phoneInfo.phoneNumber, session: mfr.session },
            recaptchaVerifier
          );
          setVerificationId(id);
        } else {
          setError("Unsupported MFA factor.");
        }
      } else {
        setError(err.message);
      }
    }
  };

  const handleMfaSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!resolver || !verificationId) {
      setError("Missing MFA details.");
      return;
    }
    try {
      const phoneCred = PhoneAuthProvider.credential(verificationId, smsCode);
      const multiCred = PhoneMultiFactorGenerator.credentialFromCredential(phoneCred)!;
      await signInWithCredential(resolver, multiCred);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        { !showMfaPrompt ? (
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                id="password"
                type="password"
                className={styles.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.buttonPrimary}>
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSignIn}>
            <p>Please enter the verification code sent to your phone.</p>
            <div className={styles.formGroup}>
              <label htmlFor="smsCode" className={styles.label}>SMS Code</label>
              <input
                id="smsCode"
                type="text"
                className={styles.input}
                value={smsCode}
                onChange={e => setSmsCode(e.target.value)}
                required
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button
              type="submit"
              className={`${styles.buttonPrimary} ${styles.buttonVerify}`}
            >
              Verify Code
            </button>
          </form>
        )}

        <div id="recaptcha-container" className={styles.recaptchaContainer} />

        <p className={styles.orText}>or</p>
        <Link href="/" className={styles.homeLink}>
          ← Back to Homepage
        </Link>
      </div>
    </div>
  );
}
