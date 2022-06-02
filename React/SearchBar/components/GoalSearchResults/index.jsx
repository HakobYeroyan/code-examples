import React, {useEffect, useState} from "react";

// Components
import GoalSearchResult from "./GoalSearchResult";
import FullListModal from "@shared/FullListModal/FullListModal";

// Utils
import {goal} from "../../../../../../models/goal";

const GoalSearchResults = ({data}) => {
    const [assigneesList, SetAssigneesList] = useState({});
    const [isFullListOpen, SetIsFullListOpen] = useState(null);

    const handleOpenAssigneesModal = (e, type, id) => {
        e.preventDefault();
        SetIsFullListOpen((type && id) ? {type, id} : null);
    };

    const handleCloseAssigneesModal = () => {
        SetIsFullListOpen(null);
    }

    useEffect(() => {
        if (!isFullListOpen) return;

        const {id, type} = isFullListOpen;

        goal.getGoalAssignmentsList(id)
            .then((res) => {
                if (res && res.data.success) {
                    SetAssigneesList(res.data[type]);
                }
            });
    }, [isFullListOpen]);

    return (
        <>
            <ul className="search_results_list">
                {data.map((item) => {
                    return (
                        <li key={item.id} className="search_results_item">
                            <GoalSearchResult item={item} handleOpenAssigneesModal={handleOpenAssigneesModal} />
                        </li>
                    );
                })}
            </ul>
            <FullListModal
                data={assigneesList}
                isVisible={isFullListOpen}
                changeModalStatus={handleCloseAssigneesModal}
            />
        </>
    );
};

export default GoalSearchResults;