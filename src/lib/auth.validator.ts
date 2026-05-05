import type { AuthFormState } from "@/hooks/useAuthForm";

export type ValidationErrors = Partial<
  Record<keyof AuthFormState | "agreed", string>
>;

//Helpers
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPER_RE = /[A-Z]/;
const NUMBER_RE = /[0-9]/;
const USER_RE = /^[a-z0-9_]+$/;
const PHONE_RE = /^[6-9]\d{9}$/; // Indian 10-digit mobile
const PINCODE_RE = /^\d{6}$/;

function isEmpty(v: string) {
  return !v || !v.trim();
}

// ─── Step 0 — Login
export function validateLoginForm(form: AuthFormState): ValidationErrors {
  const errors: ValidationErrors = {};

  if (isEmpty(form.email)) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (isEmpty(form.password)) {
    errors.password = "Password is required.";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

//Step 1 — Register: account credentials
export function validateRegisterStep1(
  form: AuthFormState,
  agreed: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  if (isEmpty(form.fullname)) {
    errors.fullname = "Full name is required.";
  } else if (form.fullname.trim().length < 2) {
    errors.fullname = "Name must be at least 2 characters.";
  }

  if (isEmpty(form.username)) {
    errors.username = "Username is required.";
  } else if (form.username.length < 3) {
    errors.username = "Username must be at least 3 characters.";
  } else if (!USER_RE.test(form.username)) {
    errors.username = "Only lowercase letters, numbers, and underscores.";
  }

  if (isEmpty(form.email)) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (isEmpty(form.password)) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!UPPER_RE.test(form.password)) {
    errors.password = "Password needs at least one uppercase letter.";
  } else if (!NUMBER_RE.test(form.password)) {
    errors.password = "Password needs at least one number.";
  }

  if (!agreed) {
    errors.agreed = "You must agree to the terms and conditions.";
  }

  return errors;
}

// Step 2 — Register: phone number
export function validateRegisterStep2(form: AuthFormState): ValidationErrors {
  const errors: ValidationErrors = {};

  if (isEmpty(form.phoneNumber)) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!PHONE_RE.test(form.phoneNumber.replace(/\s/g, ""))) {
    errors.phoneNumber = "Enter a valid 10-digit Indian mobile number.";
  }

  return errors;
}

// Step 3 — Register: address
export function validateRegisterStep3(form: AuthFormState): ValidationErrors {
  const errors: ValidationErrors = {};

  if (isEmpty(form.address)) {
    errors.address = "Street address is required.";
  } else if (form.address.trim().length < 5) {
    errors.address = "Please enter a complete address.";
  }

  if (isEmpty(form.city)) {
    errors.city = "City is required.";
  }

  if (isEmpty(form.state)) {
    errors.state = "State is required.";
  }

  if (isEmpty(form.pincode)) {
    errors.pincode = "Pincode is required.";
  } else if (!PINCODE_RE.test(form.pincode.replace(/\s/g, ""))) {
    errors.pincode = "Enter a valid 6-digit pincode.";
  }

  return errors;
}
