import { DefaultFooter } from '@ant-design/pro-components';

import styles from './index.module.less'

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{ background: 'none' }}
      copyright={`${currentYear} Mommy Bus`}
      className={styles['global-footer']}
    />
  );
};

export default Footer;
