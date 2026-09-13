import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useSecretTrigger = (clicks = 5, timeout = 1500, path = "/admin-login") => {
  const countRef = useRef(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const trigger = () => {
    countRef.current += 1;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      countRef.current = 0;
    }, timeout);

    if (countRef.current >= clicks) {
      countRef.current = 0;
      navigate(path);
    }
  };

  return trigger;
};