import React, {useState} from 'react';

// Hooks
import useTypingIndicator from './useTypingIndicator';

const Component = () => {
  const typingIndiccator = useTypingIndicator(socketTypingPages.GOALS_COMMENTS);

  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <input
        value={value}
        onChange={handleChange}
        {...typingIndiccator}
      />
    </div>
  );
};

export default Component;