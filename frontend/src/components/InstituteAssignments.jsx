import useInstituteTransport from '../hooks/useInstituteTransport';
import api from '../utils/axiosInstance';
import InstituteAssignmentSummary from './InstituteAssignmentSummary';
export default function InstituteAssignments(){const transport=useInstituteTransport(api,'/institute-app/driver');return <InstituteAssignmentSummary {...transport}/>;}
