import React from 'react';
import Sticker from '@clayui/sticker';
import {getInitials} from 'shared/util/util';

const UserCell = ({data}) => (
	<td className='table-cell-expand'>
		<div>
			<Sticker displayType='secondary' shape='user-icon' size='sm'>
				{getInitials(data.userName)}
			</Sticker>

			<span className='ml-2'>{data.userName}</span>
		</div>
	</td>
);

export default UserCell;
