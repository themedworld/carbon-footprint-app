'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuthGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'agriculteur') {
      router.replace('/loginAgri');
    } else {
      setIsChecking(false);
    }
  }, [router]);

  return { isChecking };
}
