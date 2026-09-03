import {UserSessionEvent} from 'shared/queries/UserSessionQuery';

/**
 * The id DXP reports for a page served by its default experience. Every page
 * view carries an experience, so the default is a value to filter out rather
 * than an absence to detect.
 */
const DEFAULT_EXPERIENCE_ID = 'DEFAULT';

/**
 * Names the DXP page experience that served the event, or `undefined` when the
 * event is not one the activity stream marks: a page served by its default
 * experience, a non-page event, or a data source that predates experience
 * tracking.
 *
 * The id decides whether the event is marked at all, and the name is only what
 * the marker says — so an experience the engine could not name still shows,
 * falling back to its raw id, rather than going silently unmarked.
 *
 * This is the only place the experience is read off a raw event.
 */
const getEventExperienceName = ({
	experienceId,
	experienceName,
}: UserSessionEvent): string | undefined => {
	if (!experienceId || experienceId === DEFAULT_EXPERIENCE_ID) {
		return undefined;
	}

	return experienceName || experienceId;
};

export default getEventExperienceName;
