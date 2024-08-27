"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    const storedAddress = localStorage.getItem('PublicKey');
    if(!storedAddress) router.push("/");
    if (storedAddress) {
      router.push(`/address/${storedAddress}`);
    }
  }, []);

  return (
    <div>
      <h1>Loading..</h1>
    </div>
  );
};

export default HomePage;
