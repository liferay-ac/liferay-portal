import ClayButton from '@clayui/button';
import ClayLink from '@clayui/link';
import EmptyState from 'shared/components/workspaces/EmptyState';
import getCN from 'classnames';
import JoinableWorkspacesWrapper from 'shared/components/workspaces/JoinableWorkspacesWrapper';
import Loading from 'shared/components/Loading';
import React from 'react';
import WorkspaceList from 'shared/components/workspaces/workspace-list';
import WorkspacesBasePage from 'shared/components/workspaces/BasePage';
import {close, modalTypes, open} from 'shared/actions/modals';
import {compose} from 'shared/hoc';
import {connect} from 'react-redux';
import {PLANS} from 'shared/util/subscriptions';
import {PROD_MODE} from 'shared/util/constants';
import {Routes, toRoute} from 'shared/util/router';
import {
	useFetchJoinableProjects,
	useFetchProjects
} from 'shared/hooks/useProjects';

export const routingFn = ({projects}) => {
	if (projects.length === 1 && !projects[0].groupId) {
		toRoute(Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID, {
			corpProjectUuid: projects[0].corpProjectUuid
		});

		return null;
	}
};

const WorkspacesContent = ({
	close,
	joinableProjects,
	loading,
	loadingJoinableProjects,
	open,
	projects
}) => {
	if (loading) {
		return <Loading spacer />;
	}

	const filteredProjects = projects.filter(
		({faroSubscription, groupId}) =>
			faroSubscription.name !== PLANS.basic.name || groupId
	);

	return (
		<>
			{!projects.length && !joinableProjects.length && <EmptyState />}

			{!!filteredProjects.length && (
				<WorkspaceList
					accounts={filteredProjects}
					displayAccountHeaders
					displayPlanInfo
				/>
			)}

			{loadingJoinableProjects ? (
				<Loading spacer />
			) : (
				!!joinableProjects.length && (
					<JoinableWorkspacesWrapper
						details={Liferay.Language.get(
							'workspaces-you-can-request-access-to-based-on-your-email-domain'
						)}
						title={Liferay.Language.get('workspaces-you-can-join')}
					>
						<WorkspaceList
							accounts={joinableProjects}
							isJoinableProjects
						/>
					</JoinableWorkspacesWrapper>
				)
			)}

			<div className='mt-4'>
				<ClayButton
					className='button-root mr-2'
					displayType='primary'
					onClick={() =>
						open(modalTypes.CONTACT_SALES_MODAL, {
							onClose: close
						})
					}
					size='sm'
				>
					{Liferay.Language.get('buy-paid-tier')}
				</ClayButton>

				{!PROD_MODE && (
					<ClayLink
						button
						className='button-root'
						displayType='secondary'
						href={toRoute(Routes.WORKSPACE_ADD_TRIAL)}
						small
					>
						{Liferay.Language.get('start-free-trial')}
					</ClayLink>
				)}
			</div>
		</>
	);
};

const Workspaces = ({className, close, open}) => {
	const {data: projects, loading} = useFetchProjects();
	const {
		data: joinableProjects,
		loading: loadingJoinableProjects
	} = useFetchJoinableProjects();

	if (projects.length === 1 && !projects[0].groupId) {
		return toRoute(Routes.WORKSPACE_ADD_WITH_CORP_PROJECT_UUID, {
			corpProjectUuid: projects[0].corpProjectUuid
		});
	}

	const handleDetails = () => {
		if (projects.length) {
			return [
				<p key='SELECT'>
					{Liferay.Language.get('workspaces-you-have-joined')}
				</p>
			];
		} else if (!loading && !projects.length && !joinableProjects.length) {
			return [
				<p key='EMPTY_STATE'>
					{Liferay.Language.get(
						'you-are-not-a-part-of-any-workspaces,-lets-create-a-new-one'
					)}
				</p>
			];
		}
	};

	const handleTitle = () => {
		if (projects.length || (!projects.length && !joinableProjects.length)) {
			return Liferay.Language.get('your-workspaces');
		}
	};

	routingFn({projects});

	return (
		<div className={getCN('workspaces-root', className)} key='Workspaces'>
			<WorkspacesBasePage details={handleDetails()} title={handleTitle()}>
				<WorkspacesContent
					close={close}
					joinableProjects={joinableProjects}
					loading={loading}
					loadingJoinableProjects={loadingJoinableProjects}
					open={open}
					projects={projects}
				/>
			</WorkspacesBasePage>
		</div>
	);
};

export {Workspaces};

export default compose<any>(connect(null, {close, open}))(Workspaces);
