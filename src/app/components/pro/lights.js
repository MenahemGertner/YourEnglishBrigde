'use client'
import { CircleDot } from 'lucide-react';
import Tooltip from '../common/Tooltip';

const iconData = [
  { color: 'red', content: 'אני ממש מתקשה \nלקלוט את המילה הזו!' },
  { color: 'orange', content: 'לא מכיר את המילה\n הזו מספיק טוב!' },
  { color: 'yellow', content: 'אני מכיר את המילה, \nאבל זקוק לרענון קל!' },
  { color: 'green', content: 'אני מכיר את \nהמילה הזו היטב!' },
];

const StatusIcons = () => {
  const handleClick = (color) => {
    console.log(`Clicked ${color} icon`);
  };

  const getTooltipContent = (color) => {

    return iconData.find(item => item.color === color)?.content || 'No content found';
  };

  return (
    <div className="grid grid-cols-4 gap-8 py-8">
      {iconData.map((icon) => (
        <Tooltip key={icon.color} content={getTooltipContent(icon.color)}>
          <CircleDot
            color={icon.color}
            size={48}
            className="cursor-pointer hover:scale-110 transition-transform"
            onClick={() => handleClick(icon.color)}
            dir='rtl'
          />
        </Tooltip>
      ))}
    </div>
  );
};

export default StatusIcons;