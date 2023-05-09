import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import ProjectHeader from '@/components/layout/header';
import { Route, Switch } from 'react-router-dom';
import type { IRouteComponentProps } from 'umi';
import { getFirstMenu } from '@/utils';
import { Choose, Otherwise, When } from 'tsx-control-statements/components';
import { Redirect } from 'umi';
import styles from './index.less';

// 该页面与workbench页面同级的
const MyLayout = (props: IRouteComponentProps & { routes: types.IRoute[] }) => {
    console.log('props.routes', props.routes);

    const defaultRoute = getFirstMenu(props.routes, {
        parentRoute: '/workbench',
        includeParentRoute: true,
    });

    return (
        <div className={styles['basic-layout']}>
            <Choose>
                <When condition={!!defaultRoute}>
                    <Redirect to={defaultRoute as string} exact push={false} />
                </When>
                <Otherwise>
                    <Redirect to="/403" exact push={false} />
                </Otherwise>
            </Choose>
        </div>
    );
};

export default MyLayout;
