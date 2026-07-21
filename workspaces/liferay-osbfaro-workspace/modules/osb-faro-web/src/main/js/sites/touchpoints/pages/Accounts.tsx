import KnownAccountsListCard from '../hocs/KnownAccountsListCard';
import React from 'react';

interface ITouchpointAccountsPageProps {
	router: object;
}

const TouchpointAccountsPage: React.FC<ITouchpointAccountsPageProps> = ({
	router,
}) => (
	<div className="row">
		<div className="col-sm-12">
			<KnownAccountsListCard router={router} />
		</div>
	</div>
);

export default TouchpointAccountsPage;
