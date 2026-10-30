import Card from 'shared/components/Card';
import ClayEmptyState from '@clayui/empty-state';
import ClayLabel from '@clayui/label';
import ClayTable from '@clayui/table';
import Panel from '@clayui/panel';
import React from 'react';
import {uniq} from 'lodash';

export type UtmParameter =
	| 'utmCampaign'
	| 'utmContent'
	| 'utmMedium'
	| 'utmSource'
	| 'utmTerm';

export type UtmParameters = Partial<Record<UtmParameter, string[]>>;

/**
 * The order the rows follow, which is the order a URL usually carries them in
 * rather than an alphabetical one.
 */

export const UTM_PARAMETERS: UtmParameter[] = [
	'utmSource',
	'utmMedium',
	'utmCampaign',
	'utmContent',
	'utmTerm',
];

const EMPTY_VALUE = '-';

interface IUtmParametersCardProps {
	utmParameters: UtmParameters;
}

const UtmParametersCard: React.FC<IUtmParametersCardProps> = ({
	utmParameters,
}) => {
	const isEmpty = UTM_PARAMETERS.every(
		(parameter) => !utmParameters[parameter]?.length
	);

	return (
		<Card>
			<Panel
				className="card-root"
				collapsable
				displayTitle={
					<Panel.Title className="card-title">
						{Liferay.Language.get('utm-parameters')}
					</Panel.Title>
				}
			>
				<Panel.Body>
					{isEmpty ? (
						<div className="border py-5 rounded">
							<ClayEmptyState
								className="text-center"
								description={Liferay.Language.get(
									'this-campaign-has-no-utm-parameters-associated-with-it-yet'
								)}
								small
								title={Liferay.Language.get(
									'no-utm-parameters-found'
								)}
							/>
						</div>
					) : (
						<ClayTable className="table-sm">
							<ClayTable.Head>
								<ClayTable.Row>
									<ClayTable.Cell headingCell>
										{Liferay.Language.get('parameter')}
									</ClayTable.Cell>

									<ClayTable.Cell headingCell>
										{Liferay.Language.get('value')}
									</ClayTable.Cell>
								</ClayTable.Row>
							</ClayTable.Head>

							<ClayTable.Body>
								{UTM_PARAMETERS.map((parameter) => {
									const values = uniq(
										utmParameters[parameter] ?? []
									);

									return (
										<ClayTable.Row key={parameter}>
											<ClayTable.Cell
												className="text-dark"
												headingCell
											>
												{parameter}
											</ClayTable.Cell>

											<ClayTable.Cell>
												{values.length
													? values.map((value) => (
															<ClayLabel
																displayType="secondary"
																key={value}
															>
																{value}
															</ClayLabel>
														))
													: EMPTY_VALUE}
											</ClayTable.Cell>
										</ClayTable.Row>
									);
								})}
							</ClayTable.Body>
						</ClayTable>
					)}
				</Panel.Body>
			</Panel>
		</Card>
	);
};

export default UtmParametersCard;
