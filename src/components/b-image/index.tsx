import { Image } from 'antd';
import styles from './index.less';

const BImage = ({ src, width = 50, height = 50, borderRadius = 3 }) => {
  return (
    <div className={styles['b-image']}>
      <Image
        src={src}
        className={styles['image']}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          borderRadius: `${borderRadius}px`,
        }}
      />
    </div>
  );
};

export default BImage;
