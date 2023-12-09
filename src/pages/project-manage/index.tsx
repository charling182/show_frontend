import React from 'react';
import { Redirect, useRouteMatch, useAccess } from 'umi';

const ProjectManage = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const accessPermission = useAccess();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const match = useRouteMatch();
    return <Redirect to={`${match.url}/list`} />;
};

export default ProjectManage;
