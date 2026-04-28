"use client";

import React, { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { setAuthenticated, setInitialized } from "@/slices/auth.slice";
import { getMe } from "@/thunks/user.thunk";
import { Loader } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function SessionProvider({ children }: Props) {
  const dispatch = useAppDispatch();

  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe())
      .unwrap()
      .then(() => {
        dispatch(setAuthenticated(true));
      })
      .catch(() => {
        dispatch(setAuthenticated(false));
      })
      .finally(() => {
        dispatch(setInitialized());
      });
  }, [dispatch]);

  // Show loader while session is being restored
  if (!isInitialized) {
    return <Loader />;
  }

  return <>{children}</>;
}
