'use client';
import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface AgriGuardProps {
  children: ReactNode;
}

export default function AgriGuard({ children }: AgriGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'agriculteur') {
      router.replace('/loginAgri');
    } else {
      setIsAuthorized(true);
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="loading-container">
        <p className="loading-text">Vérification de la session...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // évite un flash d’écran avant redirection
  }

  return <>{children}</>;
}
