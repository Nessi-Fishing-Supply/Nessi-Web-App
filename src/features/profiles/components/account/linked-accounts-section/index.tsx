import { SiStripe } from 'react-icons/si';
import Button from '@/components/controls/button';
import CollapsibleCard from '@/features/profiles/components/collapsible-card';
import styles from './linked-accounts-section.module.scss';

export default function LinkedAccountsSection() {
  return (
    <CollapsibleCard title="Linked Accounts">
      <div className={styles.row}>
        <div className={styles.provider}>
          <span className={styles.icon} aria-hidden="true">
            <SiStripe />
          </span>
          <div className={styles.info}>
            <span className={styles.name}>Stripe Connect</span>
            <span className={styles.status}>Not connected</span>
          </div>
        </div>
        <Button style="secondary" disabled>
          Connect
        </Button>
      </div>
    </CollapsibleCard>
  );
}
