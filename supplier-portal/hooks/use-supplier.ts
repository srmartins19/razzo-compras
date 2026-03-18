'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SupplierData {
  id:          string;
  name:        string;
  email:       string;
  companyId:   string;
  categories:  string[];
  portalAccess:boolean;
  contactName?: string;
  phone?:       string;
  taxId?:       string;
  website?:     string;
}

export function useSupplier() {
  const router = useRouter();
  const [supplier, setSupplier] = useState<SupplierData | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const sd = localStorage.getItem('supplier_data');
    if (!sd) {
      router.push('/auth/login');
      return;
    }
    try {
      setSupplier(JSON.parse(sd));
    } catch {
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('supplier_token');
    localStorage.removeItem('supplier_data');
    router.push('/auth/login');
  };

  const update = (data: Partial<SupplierData>) => {
    const updated = { ...supplier, ...data } as SupplierData;
    localStorage.setItem('supplier_data', JSON.stringify(updated));
    setSupplier(updated);
  };

  return { supplier, loading, logout, update };
}
