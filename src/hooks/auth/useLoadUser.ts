import { getMeRequest } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/auth.store";
import { useEffect, useState } from "react";

export const useLoadUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getMeRequest();

        setUser(userData);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [setUser]);

  return { loading };
};
