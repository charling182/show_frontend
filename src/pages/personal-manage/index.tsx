import React from 'react';
import { Redirect, useRouteMatch, useAccess } from 'umi';

const PersonalManage = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const accessPermission = useAccess();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const match = useRouteMatch();
    return <Redirect to={`${match.url}/user`} />;
};

export default PersonalManage;
