import React from "react";
import {Link} from "react-router-dom";

const SurveyResult = ({isUpcomingSurvey, id, children}) => {
    if (isUpcomingSurvey) {
        return (
            <div className="search_results_survey search_results_survey_upcoming">
                {children}
            </div>
        );
    }

    return (
        <Link to={`/apm/surveys/${id}`} className="search_results_survey">
            {children}
        </Link>
    );
}

export default SurveyResult;