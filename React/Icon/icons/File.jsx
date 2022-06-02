const File = ({ fill = 'currentColor', width = 24, height = 24 }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width, height }}>
      <path fill={fill} d="M0 64C0 28.65 28.65 0 64 0H224V128C224 145.7 238.3 160 256 160H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM256 128V0L384 128H256z"/>
    </svg>
  );
};

export default File;
