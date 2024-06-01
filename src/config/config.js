
const API_BASE_URL = 'https://eww5a3ve13.execute-api.ap-south-1.amazonaws.com/default/lambda-upload-image-trigger?bucket=face-mementos&property_folder=molecule_club_ifc&qt_folder=qt_faces&camera_folder=camera_1&filename=Molecule_Cam1_1.jpg';
const LOGINAPI='https://4wex2d2cz0.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login'
const VALIDATEAPI='https://218j49ra6l.execute-api.ap-south-1.amazonaws.com/default/lambda-staff-login-validate'
const VACANTSEAT='https://ok1gem39nc.execute-api.ap-south-1.amazonaws.com/default/lambda-getOccupiedVacantTable?branch_id=1'
const VISITSTART='https://wc1v1xof3j.execute-api.ap-south-1.amazonaws.com/default/post-newVisit-Invoke'
const AFTERVISIT='https://xh0xkg2tzb.execute-api.ap-south-1.amazonaws.com/default/lambda_postLinkTableStaffVisit'
// header
const token= localStorage.getItem('token');
const bucket='face-mementos';
const folder= 'qt_faces';
const camera_folder= 'camera_1';
const defaultHeaders = {
  'Content-Type': 'image/jpeg',
  'Authorization': `Bearer ${token}`,
};


export { API_BASE_URL, defaultHeaders,LOGINAPI,VISITSTART,VALIDATEAPI,VACANTSEAT,bucket,folder,camera_folder,AFTERVISIT };