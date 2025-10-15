import React from 'react';
import {toThousands} from 'shared/util/numbers';

const ToThousandsCell = ({data}) => {
	const value = data.individualCount;

	const formattedCount = toThousands(value);

	return (
		<td className='table-cell-expand '>
			<div className='text-truncate text-right mr-5'>
				{formattedCount}
			</div>
		</td>
	);
};

export default ToThousandsCell;
