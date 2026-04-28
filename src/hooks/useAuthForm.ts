'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { loginUser, registerUser } from '@/src/thunks/auth.thunk';
import { getMe } from '@/src/thunks/user.thunk';
import {
  validateLoginForm,
  validateRegisterStep1,
  validateRegisterStep2,
  validateRegisterStep3,
  type ValidationErrors,
} from '@/src/lib/validators/auth.validator';
import type { LoginRequest, RegisterRequest } from '@/src/types/auth';

export interface AuthFormState {
  email: string;
  password: string;
  username: string;
  fullname: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phoneNumber: string;
}

const INITIAL_FORM: AuthFormState = {
  email: '',
  password: '',
  username: '',
  fullname: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  phoneNumber: '',
};

export function useAuthForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Only select what you need — not the whole auth slice
  const status = useAppSelector((state) => state.auth.status);
  const error = useAppSelector((state) => state.auth.error);

  const loading = status === 'loading';

  const [form, setForm] = useState<AuthFormState>(INITIAL_FORM);
  const [regStep, setRegStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Single field handler — clears error on change
  function handleField(key: keyof AuthFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function handleToggleAgreed() {
    setAgreed((prev) => !prev);
    if (errors.agreed) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.agreed;
        return next;
      });
    }
  }

  // Returns true if valid, false if errors found
  function validateStep(step: number): boolean {
    let newErrors: ValidationErrors = {};

    if (step === 0) newErrors = validateLoginForm(form);
    if (step === 1) newErrors = validateRegisterStep1(form, agreed);
    if (step === 2) newErrors = validateRegisterStep2(form);
    if (step === 3) newErrors = validateRegisterStep3(form);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function advanceStep() {
    if (!validateStep(regStep)) return;
    setRegStep((prev) => prev + 1);
  }

  function retreatStep() {
    setRegStep((prev) => prev - 1);
    setErrors({});
  }

  async function submitLogin() {
    if (!validateStep(0)) return;

    const payload: LoginRequest = {
      email: form.email,
      password: form.password,
    };

    const result = await dispatch(loginUser(payload));

    if (loginUser.fulfilled.match(result)) {
      await dispatch(getMe());
      toast.success('Welcome back!');
      router.push('/');
    } else {
      // error is already in Redux state — no need to do anything extra
      // the component reads it from useAppSelector
    }
  }

  async function submitRegister() {
    if (!validateStep(3)) return;

    const payload: RegisterRequest = {
      fullname: form.fullname,
      email: form.email,
      username: form.username,
      phoneNumber: form.phoneNumber ? Number(form.phoneNumber) : 0,
      password: form.password,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode ? Number(form.pincode) : 0,
    };

    const result = await dispatch(registerUser(payload));

    if (registerUser.fulfilled.match(result)) {
      await dispatch(getMe());
      toast.success('Account created! Welcome to NestIQ.');
      router.push('/');
    }
  }

  return {
    // Form state
    form,
    errors,
    regStep,
    agreed,
    showPass,
    loading,
    error,
    // Handlers
    handleField,
    handleToggleAgreed,
    advanceStep,
    retreatStep,
    setShowPass,
    setRegStep,
    // Submit actions
    submitLogin,
    submitRegister,
  };
}
