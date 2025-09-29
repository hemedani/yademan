import { EditIcon, TrashIcon, MapIcon } from "../atoms/Icons";
import { useState } from "react";

interface SimpleCardProps {
  title: string;
  onEdit?: () => void; // تابع برای ویرایش (اختیاری)
  onDelete?: () => void; // تابع برای حذف (اختیاری)
  onSeedZones?: () => void; // تابع برای اضافه کردن مناطق شهر (اختیاری)
}

const EntityCard: React.FC<SimpleCardProps> = ({
  title,
  onEdit,
  onDelete,
  onSeedZones,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`border w-full max-w-sm bg-white rounded-lg p-4 flex justify-between items-center
        transition-all duration-300 ease-in-out
        ${isHovered ? 'shadow-lg transform -translate-y-1 border-blue-300' : 'shadow-md hover:shadow-lg'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className={`text-lg font-semibold truncate transition-colors duration-300 ${isHovered ? 'text-blue-600' : 'text-gray-800'}`}>
        {title}
      </h3>
      <div className="flex gap-3">
        {onSeedZones && (
          <button
            onClick={onSeedZones}
            className={`p-2 text-white rounded-full transition-all duration-300 ease-in-out transform
              ${isHovered ? 'bg-blue-600 scale-110' : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'}
              shadow hover:shadow-md`}
            title="اضافه کردن مناطق شهر"
          >
            <MapIcon />
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className={`p-2 text-white rounded-full transition-all duration-300 ease-in-out transform
              ${isHovered ? 'bg-yellow-500 scale-110' : 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105'}
              shadow hover:shadow-md`}
            title="ویرایش"
          >
            <EditIcon />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className={`p-2 text-white rounded-full transition-all duration-300 ease-in-out transform
              ${isHovered ? 'bg-red-600 scale-110' : 'bg-red-500 hover:bg-red-600 hover:scale-105'}
              shadow hover:shadow-md`}
            title="حذف"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default EntityCard;
