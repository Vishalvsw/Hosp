
import React from 'react';
import type { PlanSection } from '../types';

import { SummaryIcon } from '../components/icons/SummaryIcon';
import { FunctionalIcon } from '../components/icons/FunctionalIcon';
import { SecurityIcon } from '../components/icons/SecurityIcon';
import { TechStackIcon } from '../components/icons/TechStackIcon';
import { ArchitectureIcon } from '../components/icons/ArchitectureIcon';
import { DataModelIcon } from '../components/icons/DataModelIcon';
import { DistributionIcon } from '../components/icons/DistributionIcon';
import { RoadmapIcon } from '../components/icons/RoadmapIcon';

// --- START: Interactive DataModelDiagram Component (Retained for potential future use) ---

interface Field {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  description: string;
}

interface Node {
  id: string;
  title: string;
  description: string;
  position: { x: number; y: number };
  fields: Field[];
}

interface Edge {
  source: string;
  target: string;
}

interface Tooltip {
    visible: boolean;
    content: React.ReactNode;
    x: number;
    y: number;
}

const diagramNodes: Node[] = [
    {
      id: 'users',
      title: 'Users',
      description: 'Stores login credentials and roles for all system users.',
      position: { x: 25, y: 20 },
      fields: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Primary key for the user.' },
        { name: 'email', type: 'VARCHAR', description: 'Unique email for login.' },
        { name: 'password_hash', type: 'VARCHAR', description: 'Hashed password.' },
        { name: 'role', type: 'VARCHAR', description: 'User role (doctor, patient, admin).' },
      ],
    },
    {
      id: 'patients',
      title: 'Patients',
      description: 'Central repository for all patient demographic and contact information.',
      position: { x: 25, y: 230 },
      fields: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Primary key for the patient.' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'FK to the users table for portal login.' },
        { name: 'first_name', type: 'VARCHAR', description: 'Patient\'s first name.' },
        { name: 'date_of_birth', type: 'DATE', description: 'Patient\'s date of birth.' },
      ],
    },
    {
      id: 'doctors',
      title: 'Doctors',
      description: 'Stores information about doctors, including their specialties.',
      position: { x: 350, y: 20 },
      fields: [
        { name: 'id', type: 'UUID', isPk: true, description: 'Primary key for the doctor.' },
        { name: 'user_id', type: 'UUID', isFk: true, description: 'FK to the users table for login.' },
        { name: 'specialty', type: 'VARCHAR', description: 'Doctor\'s medical specialty.' },
      ],
    },
    {
      id: 'appointments',
      title: 'Appointments',
      description: 'Schedules and manages all patient appointments with doctors.',
      position: { x: 350, y: 230 },
      fields: [
        { name: 'id', type: 'BIGSERIAL', isPk: true, description: 'Primary key for the appointment.' },
        { name: 'patient_id', type: 'UUID', isFk: true, description: 'FK to the patient who booked.' },
        { name: 'doctor_id', type: 'UUID', isFk: true, description: 'FK to the doctor for the appointment.' },
        { name: 'start_time', type: 'TIMESTAMPTZ', description: 'Appointment start time.' },
        { name: 'status', type: 'VARCHAR', description: 'e.g., scheduled, completed.' },
      ],
    },
     {
      id: 'medical_records',
      title: 'Medical Records',
      description: 'Stores all clinical data for a patient, like notes and allergies.',
      position: { x: 25, y: 440 },
      fields: [
        { name: 'id', type: 'BIGSERIAL', isPk: true, description: 'Primary key for the EMR entry.' },
        { name: 'patient_id', type: 'UUID', isFk: true, description: 'FK to the patient this record belongs to.' },
        { name: 'appointment_id', type: 'BIGINT', isFk: true, description: 'FK to the related appointment.' },
        { name: 'record_type', type: 'VARCHAR', description: 'Type of record (e.g., note, allergy).' },
        { name: 'content', type: 'JSONB', description: 'Structured clinical data.' },
      ],
    },
  ];

const diagramEdges: Edge[] = [
    { source: 'users', target: 'patients' },
    { source: 'users', target: 'doctors' },
    { source: 'patients', target: 'appointments' },
    { source: 'doctors', target: 'appointments' },
    { source: 'patients', target: 'medical_records' },
    { source: 'appointments', target: 'medical_records' },
];

const NODE_WIDTH = 250;
const NODE_HEADER_HEIGHT = 40;
const FIELD_HEIGHT = 28;

const DataModelDiagram = () => {
    const [tooltip, setTooltip] = React.useState<Tooltip>({ visible: false, content: null, x: 0, y: 0 });

    const nodeDimensions = React.useMemo(() => {
        const dimensions = new Map<string, { width: number; height: number }>();
        diagramNodes.forEach(node => {
            dimensions.set(node.id, {
                width: NODE_WIDTH,
                height: NODE_HEADER_HEIGHT + node.fields.length * FIELD_HEIGHT + 12,
            });
        });
        return dimensions;
    }, []);

    const showTooltip = (content: React.ReactNode, e: React.MouseEvent) => {
        setTooltip({ visible: true, content, x: e.clientX + 15, y: e.clientY + 15 });
    };
    
    const hideTooltip = () => setTooltip(prev => ({ ...prev, visible: false }));
    const moveTooltip = (e: React.MouseEvent) => {
      if (tooltip.visible) {
        setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
      }
    };


    const getEdgePath = (sourceId: string, targetId: string) => {
        const sourceNode = diagramNodes.find(n => n.id === sourceId);
        const targetNode = diagramNodes.find(n => n.id === targetId);
        const sourceDim = nodeDimensions.get(sourceId);
        const targetDim = nodeDimensions.get(targetId);

        if (!sourceNode || !targetNode || !sourceDim || !targetDim) return '';

        const sx = sourceNode.position.x + sourceDim.width / 2;
        const sy = sourceNode.position.y + sourceDim.height;
        const tx = targetNode.position.x + targetDim.width / 2;
        const ty = targetNode.position.y;
        
        let path = '';
        if(sourceNode.position.x === targetNode.position.x) { // Vertical connection
            path = `M ${sx} ${sy} L ${tx} ${ty}`;
        } else { // Horizontal / Diagonal
            const sourceExitX = sourceNode.position.x + sourceDim.width;
            const sourceExitY = sourceNode.position.y + sourceDim.height / 2;
            const targetEntryX = targetNode.position.x;
            const targetEntryY = targetNode.position.y + targetDim.height / 2;
            const C_OFFSET = 60;
            path = `M ${sourceExitX} ${sourceExitY} C ${sourceExitX + C_OFFSET} ${sourceExitY} ${targetEntryX - C_OFFSET} ${targetEntryY} ${targetEntryX} ${targetEntryY}`;
        }
        return path;
    };

    return (
        <div className="bg-slate-50 p-4 rounded-lg relative w-full h-[650px] overflow-hidden">
            <p className="text-sm text-slate-600 mb-4 absolute top-4 left-4">An interactive representation of key relationships in the HMS data model. Hover over tables or fields for details.</p>
            {tooltip.visible && (
                <div 
                    className="fixed bg-slate-800 text-white text-xs rounded-md shadow-lg p-2 z-50 max-w-xs pointer-events-none"
                    style={{ top: tooltip.y, left: tooltip.x }}
                >
                    {tooltip.content}
                </div>
            )}
            <svg width="100%" height="100%" className="absolute top-0 left-0">
                <defs>
                    <marker
                        id="arrowhead"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                    </marker>
                </defs>
                <g>
                    {diagramEdges.map((edge, i) => (
                        <path
                            key={i}
                            d={getEdgePath(edge.source, edge.target)}
                            fill="none"
                            stroke="#94a3b8"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                        />
                    ))}
                </g>
            </svg>
            
            {diagramNodes.map(node => {
                const dims = nodeDimensions.get(node.id);
                return (
                    <div
                        key={node.id}
                        className="absolute bg-white rounded-lg shadow-lg border-2 border-slate-200 flex flex-col transition-all duration-300 hover:border-cyan-500 hover:shadow-xl"
                        style={{
                            left: node.position.x,
                            top: node.position.y,
                            width: dims?.width,
                            height: dims?.height
                        }}
                        onMouseEnter={(e) => showTooltip(<p>{node.description}</p>, e)}
                        onMouseLeave={hideTooltip}
                        onMouseMove={moveTooltip}
                    >
                        <div className="bg-slate-100 p-2 rounded-t-md border-b-2 border-slate-200">
                            <h4 className="font-bold text-sm text-slate-700 text-center">{node.title}</h4>
                        </div>
                        <ul className="p-2 text-xs space-y-1">
                            {node.fields.map(field => (
                                <li 
                                    key={field.name} 
                                    className="flex items-center justify-between p-1 rounded hover:bg-slate-100"
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      showTooltip(
                                        <div>
                                            <p className="font-bold">{field.name}</p>
                                            <p className="text-cyan-300">{field.type}</p>
                                            <p className="mt-1">{field.description}</p>
                                        </div>, e
                                      );
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      showTooltip(<p>{node.description}</p>, e);
                                    }}
                                >
                                    <div className="flex items-center space-x-2">
                                        {field.isPk && <span title="Primary Key" className="text-amber-500 font-bold">PK</span>}
                                        {field.isFk && <span title="Foreign Key" className="text-sky-500 font-bold">FK</span>}
                                        <span className={field.isPk || field.isFk ? 'font-semibold text-slate-800' : 'text-slate-600'}>{field.name}</span>
                                    </div>
                                    <span className="text-slate-500">{field.type}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}
        </div>
    );
};

// --- END: Interactive DataModelDiagram Component ---


export const PLAN_DATA: PlanSection[] = [
  {
    id: 'basic_modules',
    title: 'Basic Modules (MVP)',
    icon: RoadmapIcon,
    content: [
      {
        subtitle: 'Overview',
        type: 'text',
        details: 'These cover the core hospital operations you can’t skip.',
      },
      {
        subtitle: 'Authentication & User Management',
        type: 'list',
        details: [
          'User roles (Patient, Doctor, Nurse, Receptionist, Admin).',
          'Login/Signup (password, OAuth).',
          'Profile management.',
        ],
      },
      {
        subtitle: 'Patient Management',
        type: 'list',
        details: [
          'Registration (demographics, contact).',
          'Patient records (visit history, allergies, insurance info).',
        ],
      },
      {
        subtitle: 'Doctor & Staff Management',
        type: 'list',
        details: [
          'Doctor profiles (specialty, schedule).',
          'Staff directory (nurses, reception).',
        ],
      },
      {
        subtitle: 'Appointment Scheduling',
        type: 'list',
        details: [
          'Calendar-based booking.',
          'Doctor availability.',
          'Rescheduling & cancellations.',
          'Notifications (SMS/email reminders).',
        ],
      },
      {
        subtitle: 'Electronic Medical Records (Basic EMR)',
        type: 'list',
        details: [
          'Basic consultation notes.',
          'Diagnoses & treatment history.',
          'Prescription records.',
        ],
      },
      {
        subtitle: 'Billing & Invoicing',
        type: 'list',
        details: [
          'Simple invoice generation.',
          'Payment tracking (cash/card/UPI).',
        ],
      },
    ],
  },
  {
    id: 'intermediate_modules',
    title: 'Intermediate Modules (Phase 2)',
    icon: FunctionalIcon,
    content: [
      {
        subtitle: 'Overview',
        type: 'text',
        details: 'These extend operations to departments, pharmacy, labs, and compliance.',
      },
      {
        subtitle: 'Pharmacy Management',
        type: 'list',
        details: [
          'Drug catalog & stock levels.',
          'Prescription integration.',
          'Dispensing workflows.',
          'Expiry tracking.',
        ],
      },
      {
        subtitle: 'Laboratory Management',
        type: 'list',
        details: [
          'Test orders from doctors.',
          'Sample collection workflow.',
          'Upload results (structured + files).',
        ],
      },
      {
        subtitle: 'Radiology Management (Basic)',
        type: 'list',
        details: [
          'Imaging requests (X-ray, MRI, CT).',
          'Report storage & linking to patient EMR.',
        ],
      },
      {
        subtitle: 'Inpatient (IPD) Management',
        type: 'list',
        details: [
          'Admission & discharge.',
          'Bed/ward allocation.',
          'Nursing notes & vitals.',
        ],
      },
      {
        subtitle: 'Insurance & Claims',
        type: 'list',
        details: [
          'Store patient insurance info.',
          'Claims submission & status.',
          'Policy coverage rules.',
        ],
      },
      {
        subtitle: 'Dashboards (Operational)',
        type: 'list',
        details: [
          'Admin: appointments, revenue, utilization.',
          'Doctor: upcoming appointments, workload.',
        ],
      },
    ],
  },
  {
    id: 'advanced_modules',
    title: 'Advanced Modules (Phase 3)',
    icon: TechStackIcon,
    content: [
      {
        subtitle: 'Overview',
        type: 'text',
        details: 'These make the HMS scalable, smart, and competitive.',
      },
      {
        subtitle: 'Surgery & OT Management',
        type: 'list',
        details: [
          'Pre-op scheduling.',
          'OT calendar & resources.',
          'Anesthesiology notes.',
        ],
      },
      {
        subtitle: 'Radiology & PACS Integration (Advanced)',
        type: 'list',
        details: ['DICOM viewer.', 'Direct PACS integration.'],
      },
      {
        subtitle: 'Advanced EMR/EHR',
        type: 'list',
        details: [
          'Structured templates per specialty (Cardiology, Pediatrics, etc.).',
          'Longitudinal patient records.',
          'Inter-department shared case notes.',
        ],
      },
      {
        subtitle: 'Telemedicine',
        type: 'list',
        details: [
          'Video consults.',
          'E-prescriptions.',
          'Patient mobile app for virtual care.',
        ],
      },
      {
        subtitle: 'Wearable/IoT Integration',
        type: 'list',
        details: [
          'Sync vitals (BP, glucose, heart rate).',
          'Remote patient monitoring.',
        ],
      },
      {
        subtitle: 'Inventory & Procurement',
        type: 'list',
        details: [
          'Beyond pharmacy → hospital supplies, surgical kits.',
          'Vendor/supplier management.',
        ],
      },
      {
        subtitle: 'Analytics & BI (Advanced Dashboards)',
        type: 'list',
        details: [
          'Predictive analytics (bed occupancy, peak hours).',
          'Doctor KPIs, specialty-level insights.',
          'Patient outcome analysis.',
        ],
      },
      {
        subtitle: 'AI Decision Support',
        type: 'list',
        details: [
          'Diagnosis suggestions.',
          'Drug interaction alerts.',
          'Risk prediction models.',
        ],
      },
      {
        subtitle: 'CRM & Patient Engagement',
        type: 'list',
        details: [
          'Patient feedback & surveys.',
          'Follow-up reminders.',
          'Loyalty/discount programs.',
        ],
      },
      {
        subtitle: 'Security & Compliance (Enterprise)',
        type: 'list',
        details: [
          'HIPAA/GDPR audit-ready reports.',
          'Data encryption at rest & in transit.',
          'Consent management.',
          'MFA for clinicians.',
        ],
      },
    ],
  },
];
