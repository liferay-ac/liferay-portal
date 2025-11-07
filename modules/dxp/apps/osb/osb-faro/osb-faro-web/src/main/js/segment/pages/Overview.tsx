import CriteriaCard from 'segment/components/criteria-card';

import React, {useCallback, useEffect, useRef} from 'react';
import {connect, ConnectedProps} from 'react-redux';
import {debounce} from 'lodash';
import {ReferencedObjectsProvider} from 'segment/segment-editor/dynamic/context/referencedObjects';
import {RootState} from 'shared/store';
import {Segment} from 'shared/util/records';

const HEADER_MARGIN = 16;
const connector = connect((store: RootState, {groupId}: {groupId: string}) => ({
	timeZoneId: store.getIn([
		'projects',
		groupId,
		'data',
		'timeZone',
		'timeZoneId'
	])
}));

type PropsFromRedux = ConnectedProps<typeof connector>;

interface IOverviewProps extends PropsFromRedux {
	channelId: string;
	groupId: string;
	id: string;
	segment: Segment;
	tabId?: string;
}

const Overview: React.FC<IOverviewProps> = ({segment, timeZoneId}) => {
	const _sideColumnRef = useRef<any>();

	const updateHeaderVisible = useCallback(
		debounce(() => {
			const node = _sideColumnRef.current;

			if (node) {
				const {top} = node.parentElement.getBoundingClientRect();

				const headerSize = top > HEADER_MARGIN ? top : HEADER_MARGIN;

				node.style.maxHeight = `calc(100vh - ${headerSize}px)`;
			}
		}, 250),
		[]
	);

	useEffect(() => {
		updateHeaderVisible();

		window.addEventListener('scroll', updateHeaderVisible);

		return () => window.removeEventListener('scroll', updateHeaderVisible);
	}, []);

	const {criteriaString, includeAnonymousUsers} = segment;

	return (
		<ReferencedObjectsProvider segment={segment}>
			<CriteriaCard
				criteriaString={criteriaString}
				includeAnonymousUsers={includeAnonymousUsers}
				timeZoneId={timeZoneId}
			/>
		</ReferencedObjectsProvider>
	);
};

export default connector(Overview);
