import { getStatusColor, getStatusLabel } from '../../utils/format'

const StatusBadge = ({ status }) => {
  return (
    <span className={`badge-status ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  )
}

export default StatusBadge
