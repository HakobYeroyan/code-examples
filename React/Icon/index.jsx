import {
  BoxesPacking,
  File,
  Folder,
  Pencil,
  TrashCan,
} from './icons';

const icons = {
  'boxes-packing': BoxesPacking,
  file: File,
  folder: Folder,
  pencil: Pencil,
  'trash-can': TrashCan,
};

const Icon = ({name, ...props}) => {
  const IconComponent = icons[name];

  return (
    <IconComponent {...props} />
  );
};

export default Icon;
