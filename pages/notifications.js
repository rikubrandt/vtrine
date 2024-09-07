import { useContext } from 'react';
import Layout from '../components/Layout';
import { UserContext } from '../lib/context';
import Notifications from '../components/Notifications';

function NotificationsPage() {
  const { user } = useContext(UserContext); 

  return (
    <Layout>
      <Notifications user={user} />
    </Layout>
  );
}

export default NotificationsPage;
