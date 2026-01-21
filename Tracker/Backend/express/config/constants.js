const projectStatuses = {
  'not-started': {
    label: 'Not Started',
    bg: '#f1f5f9',
    color: '#475569'
  },
  'pending': {
    label: 'Pending',
    bg: '#fef3c7',
    color: '#92400e'
  },
  'in-progress': {
    label: 'In Progress',
    bg: '#dbeafe',
    color: '#1e40af'
  },
  'on-hold': {
    label: 'On Hold',
    bg: '#fdfecaff',
    color: '#ffbc02ff'
  },
  'completed': {
    label: 'Completed',
    bg: '#d1fae5',
    color: '#065f46'
  },
  'cancelled': {
    label: 'Cancelled',
    bg: '#fecaca',
    color: '#7f1d1d'
  },
  'emergency': {
    label: 'Emergency',
    bg: '#ff0000ff',
    color: '#ffffff'
  }
};

const teamMembers = [
  "Anja Marx",
  "Anrich van Rooyen",
  "Charl Marais",
  "Christo Swanepoel",
  "Desiree Snyman",
  "Dirk Bezuidenhout",
  "John Roux",
  "Lida Buckle",
  "Piet Lombard",
  "Quintin Watkins",
  "Raymond Hulley",
  "Siyabonga Nyembe",
  "S'thembiso Ndebele",
  "Waldo van Wyk"
];

const workflowStages = {
  "3dLaserScanning": [
    "Scanning",
    "Register",
    "Processing",
    "Modelling",
    "Out of Roundness",
    "Nozzle location",
    "Admin",
    "Other"
  ],
  "handheld": [
    "Scanning",
    "Register",
    "Processing",
    "Modelling",
    "Out of Roundness",
    "Nozzle location",
    "Admin",
    "Other"
  ],
  "slam": [
    "Scanning",
    "Register",
    "Processing",
    "Modelling",
    "Admin",
    "Other"
  ],
  "dji": [
    "Flight Permarations",
    "Scanning",
    "Topographical",
    "Register",
    "Processing",
    "Admin",
    "Other"
  ],
  "dronePhotos": [
    "Flight Permarations",
    "Photos",
    "Processing",
    "Admin",
    "Other"
  ],
  "Measurement": [
    "Planning",
    "Preparations",
    "Installing",
    "Measuring",
    "Data Processing",
    "Assistance",
    "Doc Checking",
    "Report",
    "Admin",
    "Other"
  ],
  "survey": [
    "Survey",
    "Download & calculations",
    "Admin",
    "Other"
  ],
  "GPRScanner": [
    "Site Calibration",
    "TOPO Survey",
    "Download & calculations",
    "Drawings",
    "Admin",
    "Other"
  ],
  "leicaGS18t": [
    "Conducted GPR Survey",
    "Surveying of Services",
    "Download & calculations",
    "Scan Report",
    "CAD Drawing",
    "Admin",
    "Other"
  ]
};

const stageLabels = {
  "3dLaserScanning": "3D Laser Scanning",
  "handheld": "Handheld",
  "slam": "SLAM",
  "dji": "DJI",
  "dronePhotos": "Drone Photos",
  "measurement": "Measurement",
  "survey": "Survey",
  "GPRScanner": "GPR Scanner",
  "ultra": "Ultra",
  "leicaGS18t": "Leica GS18t"
};

module.exports = {
  projectStatuses,
  teamMembers,
  workflowStages,
  stageLabels
};
