import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Layout = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch('/api/check-auth');
        const data = await response.json();

        if (data.isAuthenticated) {
          setIsAuthenticated(true);
          router.push('/');
        } else {
          if (router.pathname !== '/login' && router.pathname !== '/register') {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    };

    checkAuthentication();
  }, [router.pathname]);



  return <div>{children}</div>;
};

export default Layout;
