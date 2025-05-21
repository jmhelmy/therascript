"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  RecaptchaVerifier,
  MultiFactorResolver,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "@/lib/auth";

let recaptchaVerifier: RecaptchaVerifier;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showMfaPrompt, setShowMfaPrompt] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [resolver, setResolver] = useState<MultiFactorResolver | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // Redirect to dashboard on successful login
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "auth/multi-factor-auth-required") {
        const multiFactorResolver = err.resolver as MultiFactorResolver;
        setResolver(multiFactorResolver);
        setShowMfaPrompt(true);

        // Assuming the first factor is phone for simplicity
        const phoneInfo = multiFactorResolver.hints[0];
        if (phoneInfo.factorId === PhoneMultiFactorGenerator.FACTOR_ID) {
          const phoneAuthProvider = new PhoneAuthProvider(auth);
          if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
              'size': 'invisible',
              'callback': (response: any) => {
                // reCAPTCHA solved, a response is returned
              },
              'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                setError("reCAPTCHA expired. Please try again.");
              }
            });
          }
          const verificationId = await phoneAuthProvider.verifyPhoneNumber(
            {
              phoneNumber: phoneInfo.phoneNumber,
              session: multiFactorResolver.session,
            },
            recaptchaVerifier
          );
          setVerificationId(verificationId);
        } else {
          setError("Unsupported MFA factor type.");
        }
      } else {
        setError(err.message);
      }
    }
  };

  const handleMfaSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      if (resolver && verificationId && smsCode) {
        const phoneAuthCredential = PhoneAuthProvider.credential(
          verificationId,
          smsCode
        );
        const multiFactorCredential = PhoneMultiFactorGenerator.credentialFromCredential(
          phoneAuthCredential
        );
        await signInWithCredential(resolver, multiFactorCredential);
        router.push("/dashboard"); // Redirect to dashboard on successful MFA completion
      } else {
        setError("Missing MFA details.");
      }
    } catch (err: any) {
      console.error("MFA sign-in error:", err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {!showMfaPrompt ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSignIn}>
            <p className="mb-4">Please enter the verification code sent to your phone.</p>
            <div className="mb-4">
              <label className="block text-gray-700">SMS Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                value={smsCode}
                onChange={(e) => setSmsCode(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Verify Code
            </button>
          </form>
        )}
        <div id="recaptcha-container"></div> {/* reCAPTCHA container */}
      </div>
    </div>
  );
}