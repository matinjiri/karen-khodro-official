"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "phone" | "otp";

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((current) => {
        if (current <= 1) {
          clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  const normalizePhone = (value: string) => {
    return value
      .replace(/[۰-۹]/g, (char) =>
        String("۰۱۲۳۴۵۶۷۸۹".indexOf(char))
      )
      .replace(/[^\d]/g, "");
  };

  const handleSendOtp = async () => {
    const normalizedPhone = normalizePhone(phone);

    setError("");

    if (!normalizedPhone) {
      setError("شماره موبایل را وارد کنید.");
      return;
    }

    if (!/^09\d{9}$/.test(normalizedPhone)) {
      setError("شماره موبایل معتبر نیست.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "ارسال کد تأیید ناموفق بود.");
        return;
      }

      setPhone(normalizedPhone);
      setOtp("");
      setStep("otp");
      setResendTimer(60);
    } catch {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

const handleVerifyOtp = async (otpCode?: string) => {
  const value = String(otpCode ?? otp);

  const normalizedOtp = value.replace(/\D/g, "");

  setError("");

  if (normalizedOtp.length !== 6) {
    setError("کد تأیید باید ۶ رقم باشد.");
    return;
  }

  setLoading(true);

  try {
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        code: normalizedOtp,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setError(data.message || "کد تأیید صحیح نیست.");
      return;
    }

    router.push("/my-account");
    router.refresh();
  } catch (error) {
    console.error("Verify OTP error:", error);
    setError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
  } finally {
    setLoading(false);
  }
};

  const handleResend = async () => {
    if (resendTimer > 0 || resendLoading) return;

    setError("");
    setResendLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "ارسال مجدد کد ناموفق بود.");
        return;
      }

      setOtp("");
      setResendTimer(60);
    } catch {
      setError("خطایی رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setResendLoading(false);
    }
  };

const handleOtpChange = (value: string) => {
  const normalized = value
    .replace(/[۰-۹]/g, (char) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(char))
    )
    .replace(/\D/g, "")
    .slice(0, 6);

  setOtp(normalized);
  setError("");

  if (normalized.length === 6) {
    handleVerifyOtp(normalized);
  }
};
  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4"
    >
      <div className="w-full max-w-[430px]">
        <div className="bg-white rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.07)] px-6 py-8 sm:px-8 sm:py-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center">
                <span className="text-white text-lg font-bold">K</span>
              </div>

              <div className="text-right">
                <div className="font-bold text-[18px] text-[#111]">
                  کارن خودرو
                </div>

                <div className="text-[11px] text-gray-400 mt-0.5">
                  فروش و خدمات خودرو
                </div>
              </div>
            </div>
          </div>

          {step === "phone" ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#111]">
                  ورود به حساب کاربری
                </h1>

                <p className="text-[14px] text-gray-500 mt-3 leading-7">
                  برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید.
                </p>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <label
                  htmlFor="phone"
                  className="block text-[13px] font-medium text-[#333] mb-2"
                >
                  شماره موبایل
                </label>

                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => {
                      const value = normalizePhone(e.target.value);
                      setPhone(value);
                      setError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSendOtp();
                      }
                    }}
                    placeholder="09123456789"
                    maxLength={11}
                    className="
                      w-full h-[54px]
                      rounded-2xl
                      border border-[#e5e5e5]
                      bg-[#fafafa]
                      px-4
                      text-[15px]
                      outline-none
                      transition
                      focus:border-[#111]
                      focus:bg-white
                    "
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-[13px] text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="
                  w-full h-[54px]
                  rounded-2xl
                  bg-red-600
                  text-white
                  font-medium
                  text-[15px]
                  transition
                  hover:bg-[#222]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "در حال ارسال..." : "دریافت کد تأیید"}
              </button>

              <p className="text-center text-[11px] text-gray-400 leading-6 mt-5">
                با ورود به حساب کاربری، قوانین و شرایط استفاده
                از سایت را می‌پذیرید.
              </p>
            </>
          ) : (
            <>
              {/* OTP Header */}
              <div className="text-center mb-8">
                <h1 className="text-[24px] font-bold text-[#111]">
                  کد تأیید
                </h1>

                <p className="text-[14px] text-gray-500 mt-3 leading-7">
                  کد ارسال شده به شماره
                  <br />

                  <span
                    dir="ltr"
                    className="inline-block text-[#111] font-medium mt-1"
                  >
                    {phone}
                  </span>
                </p>
              </div>

              {/* OTP */}
              <div className="mb-5">
                <label
                  htmlFor="otp"
                  className="block text-[13px] font-medium text-[#333] mb-2"
                >
                  کد تأیید
                </label>

                <input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  dir="ltr"
                  value={otp}
                  onChange={(e) => handleOtpChange(e.target.value)}
                  maxLength={6}
                  placeholder="------"
                  className="
                    w-full h-[60px]
                    rounded-2xl
                    border border-[#e5e5e5]
                    bg-[#fafafa]
                    px-4
                    text-center
                    tracking-[12px]
                    text-[22px]
                    font-semibold
                    outline-none
                    transition
                    focus:border-[#111]
                    focus:bg-white
                  "
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-[13px] text-red-600">
                    {error}
                  </p>
                </div>
              )}

              {/* Verify */}
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="
                  w-full h-[54px]
                  rounded-2xl
                  bg-[#111]
                  text-white
                  font-medium
                  text-[15px]
                  transition
                  hover:bg-[#222]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "در حال ورود..." : "تأیید و ورود"}
              </button>

              {/* Resend */}
              <div className="flex items-center justify-center gap-2 mt-5 text-[13px]">
                <span className="text-gray-400">
                  کد را دریافت نکردید؟
                </span>

                {resendTimer > 0 ? (
                  <span className="text-gray-400">
                    ارسال مجدد تا {resendTimer} ثانیه
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="text-[#111] font-medium hover:underline disabled:opacity-50"
                  >
                    {resendLoading ? "در حال ارسال..." : "ارسال مجدد"}
                  </button>
                )}
              </div>

              {/* Change phone */}
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError("");
                }}
                className="
                  w-full
                  mt-4
                  text-[13px]
                  text-gray-500
                  hover:text-[#111]
                  transition
                "
              >
                تغییر شماره موبایل
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
