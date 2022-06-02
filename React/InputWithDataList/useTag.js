import {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';

// Hooks
import useDebounce from './useDebounce';

// Utils
import {tagging} from '@models/tagging';

const defaultFormatter = (item) => {
    return {
        id: item.id,
        value: item.name,
        avatar: item.avatar
    };
};

const sections = {
    goals: 'getTagsGoalsKRs',
    checkin: 'getCheckins',
};

const useTag = (section = 'goals', dataFormatter = defaultFormatter) => {
    const {id} = useParams();

    const [value, SetValue] = useState('');
    const [chosenList, SetChosenList] = useState([]);
    const [chosenListValues, SetChosenListValues] = useState({});
    const [foundList, SetFoundList] = useState([]);
    const [isSelected, SetIsSelected] = useState(false);

    const tagRegEx = /@[^@|.]+$/;

    const handleChange = (e) => {
        SetValue(e.target.value);

        const isBackspace = e.target.value.length < value.length;

        // Detecting "@" input
        if (e.target.value.at(-1) === '@' && !isBackspace) {
            SetIsSelected(false);
        }

        // Detecting tag remove
        let foundId;
        const endsWithQueryString = Object
            .entries(chosenListValues)
            .some(([listKey, listValue]) => {
                foundId = listKey;
                return value.endsWith(`@${listValue}`);
            });

        if (endsWithQueryString && isBackspace) {
            SetValue(value.replace(tagRegEx, ''));
            SetChosenList((prevState) => prevState.filter((item) => item !== foundId));
        }
    };


    const handleSelect = (e) => {
        const {value: itemValue, label} = e.currentTarget.dataset;

        SetChosenList((prevState) => [itemValue, ...prevState]);
        SetChosenListValues((prevState) => ({[itemValue]: label, ...prevState}));

        SetValue(value.replace(tagRegEx, `@${label}`));

        SetIsSelected(true);
    };


    const debouncedCommentValue = useDebounce(value, 500);


    const handleSearchTaggedUser = async (id, name) => {
        try {
            const response = await tagging[sections[section]](id, name);
            if (response?.data?.success) {
                SetFoundList(response.data.users);
            }
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if (tagRegEx.test(debouncedCommentValue)) {
            const splitedValue = debouncedCommentValue.split('@');
            const name = splitedValue.at(-1);

            handleSearchTaggedUser(id, name);
        } else {
            !foundList.length && SetFoundList([]);
        }
        // eslint-disable-next-line
    }, [debouncedCommentValue]);

    // eslint-disable-next-line
    const formattedList = useMemo(() => foundList.map(dataFormatter), [foundList]);

    return {
        value,
        SetValue,
        chosenList,
        handleChange,
        handleSelect,
        foundList,
        formattedList,
        isSelected,
        SetIsSelected,
    };
};

export default useTag;