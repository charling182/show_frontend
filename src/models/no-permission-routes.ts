import { useState } from 'react';

const NoPermissionRoutes = () => {
    const [noPermissionRoutes, setNoPermissionRoutes] = useState<string[]>([]);

    return {
        noPermissionRoutes,
        setNoPermissionRoutes,
    };
};

export default NoPermissionRoutes;
