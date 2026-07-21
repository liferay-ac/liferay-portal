import KnownAccountsListCard from '../hocs/KnownAccountsListCard';
import React from 'react';
import {Router} from 'shared/types';

const Accounts: React.FC<{
	router: Router;
}> = ({router}) => (
	<div className="row">
		<div className="col-sm-12">
			<KnownAccountsListCard router={router} />
		</div>
	</div>
);

export default Accounts;
