interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({ rows = 5, columns = 4 }: TableSkeletonProps) {
  return (
    <div className="w-full animate-pulse">
      {/* Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <div 
            key={`header-${i}`} 
            className="flex-1 h-8 bg-gray-200 dark:bg-gray-700 rounded mr-2"
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="flex py-3 border-b border-gray-100 dark:border-gray-800"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="flex-1 h-6 bg-gray-100 dark:bg-gray-800 rounded mr-2"
            />
          ))}
        </div>
      ))}
    </div>
  );
}