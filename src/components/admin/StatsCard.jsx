const StatsCard = ({ title, value, icon, colorClass = 'bg-primary-500', change }) => {
  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg h-full transition-all duration-300 hover:shadow-xl">
      <div className="p-5 h-28">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClass}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-bold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change ? (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
          <div className="text-sm">
            <span className={`font-medium ${change.isIncrease ? 'text-success-600' : 'text-danger-600'}`}>
              {change.isIncrease ? '↑' : '↓'} {change.value}%
            </span>
            <span className="text-gray-500 ml-2">from previous period</span>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
          <div className="text-sm text-gray-500">
            No change data available
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsCard