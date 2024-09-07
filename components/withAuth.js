import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../lib/context';
import Loader from './Loader';

export function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useContext(UserContext); 
    const router = useRouter();
    const [initialized, setInitialized] = useState(false); 

    useEffect(() => {
      if (!loading && !user) {
        router.push('/');
      } else if (!loading && user) {
        setInitialized(true);
      }
    }, [user, loading, router]);

    if (loading || !initialized) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader show={loading || !initialized} />
        </div>
      );
    }

    return <Component {...props} />;
  };
}
