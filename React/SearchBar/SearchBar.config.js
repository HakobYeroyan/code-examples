import GoalSearchResult from "./components/GoalSearchResults";
import WeeklyItemsSearchResult from "./components/WeeklyItemsSearchResult";
import CheckInSearchResult from "./components/CheckInSearchResult";
import SurveySearchResult from "./components/SurveySearchResult";
import TeamSearchResult from "./components/TeamSearchResult";
import PeopleSearchResults from "./components/PeopleSearchResults";
import FormTemplateSearchResult from "./components/FormTemplateSearchResult";

const pairs = {
    goals: {title: 'Goals', type: 'goals', ListComponent: GoalSearchResult},
    weekly_tasks: {title: 'Weekly Items', type: 'weekly_status', Component: WeeklyItemsSearchResult},
    checkins: {title: 'Check-Ins', type: 'check-ins', Component: CheckInSearchResult},
    surveys: {title: 'Surveys', type: 'surveys', Component: SurveySearchResult},
    teams: {title: 'Teams', type: 'teams-people', Component: TeamSearchResult},
    users: {title: 'People', type: 'teams-people', ListComponent: PeopleSearchResults},
    forms: {title: 'Form Templates', type: 'form_templates', Component: FormTemplateSearchResult},
};

const getResultItem = (key, data) => {
    return {
        data,
        ...pairs[key],
    };
};

export const getResults = (data) => {
    const dataArray = [];

    for (let key in data) {
        dataArray.push(getResultItem(key, data[key]));
    }

    return dataArray;
};
