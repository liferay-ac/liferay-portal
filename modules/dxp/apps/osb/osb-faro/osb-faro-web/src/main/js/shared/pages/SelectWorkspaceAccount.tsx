import Loading from 'shared/components/Loading';
import React from 'react';
import WorkspaceList from 'shared/components/workspaces/workspace-list';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {getBasicProjects, getSingleProjectRoute} from 'shared/util/projects';
import {Routes, setUriQueryValue, toRoute} from 'shared/util/router';
import {sub} from 'shared/util/lang';
import {useCurrentUser} from 'shared/hooks/useCurrentUser';
import {useFetchProjects} from 'shared/hooks/useProjects';

const checkDisabled = ({configured}) => configured;

export const routingFn = ({projects}) => {
	const basicProjects = getBasicProjects(projects);

	if (basicProjects.length === 1) {
		getSingleProjectRoute(basicProjects[0]);

		return null;
	} else if (
		!basicProjects.some(basicProject => !basicProject.get('groupId'))
	) {
		setUriQueryValue(
			toRoute(Routes.WORKSPACES),
			'allBasicConfigured',
			true
		);

		return null;
	}
};

const SelectWorkspaceAccount = () => {
	const currentUser = useCurrentUser();
	const {data: projects, loading} = useFetchProjects();

	if (loading) {
		return <Loading />;
	}

	routingFn({projects});

	return (
		<div className='select-account-root'>
			<WorkspacesBasePage
				details={[
					<p key='SELECT'>
						{sub(
							Liferay.Language.get(
								'weve-found-multiple-accounts-associated-with-x-.-you-can-have-one-basic-tier-workspace-of-analytics-cloud-per-account.-please-associate-this-analytics-cloud-workspace-to-an-account'
							),
							[
								<b key='emailAddress'>
									{currentUser.emailAddress}
								</b>
							],
							false
						)}
					</p>
				]}
				title={Liferay.Language.get('select-account')}
			>
				<WorkspaceList
					accounts={getBasicProjects(projects)}
					checkDisabled={checkDisabled}
				/>
			</WorkspacesBasePage>
		</div>
	);
};

export default SelectWorkspaceAccount;
