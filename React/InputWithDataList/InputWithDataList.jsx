import React from 'react';

// Components
import AvatarImg from '@shared/AvatarImg/AvatarImg';

// Styles
import './styles/input_with_data_list.scss';

const InputWithDatalistList = ({
  children,
  datalist = [],
  listId = null,
  datalistListClassName = '',
  datalistItemClassName = '',
  onItemSelect,
  isSelected,
}) => {
  const childrenProps = children.props;
  const { value: childrenValue = '', 'data-value': childrenDataValue = '' } = childrenProps;

  const value = childrenValue || childrenDataValue || '';

  const tagRegEx = /@[^@|.]+$/;

  const showList = tagRegEx.test(value) && !isSelected;

  return (
    <>
      {children}
      {showList && !!datalist.length && <div id={listId} className={`datalist-list ${datalistListClassName}`} role="list">
        {datalist.map((item) => {
          return (
            <div
              className={`datalist-list-item ${datalistItemClassName}`}
              data-value={item.id}
              data-label={item.value}
              key={item.id}
              onClick={onItemSelect}
              role="listitem"
            >
              <AvatarImg src={item.avatar} imgClassName="data-list-item-img" />
              <span>{item.value}</span>
            </div>
          );
        })}
      </div>}
    </>
  );
};

export default InputWithDatalistList;