import { 
  Vehicle, 
  FaultTicket, 
  ServiceSchedule, 
  Technician, 
  DtcDefinition 
} from '../types';

export const DTC_LIBRARY: DtcDefinition[] = [
  {
    code: 'P0300',
    title: 'Random / Multiple Cylinder Misfire Detected',
    system: 'Powertrain - Ignition / Fuel',
    severity: 'Critical',
    commonCauses: ['Faulty spark plugs or ignition coils', 'Clogged fuel injectors', 'Low fuel pressure', 'Vacuum leak'],
    recommendedAction: 'Inspect ignition coils, check fuel pressure, and test cylinder compression.'
  },
  {
    code: 'P0420',
    title: 'Catalyst System Efficiency Below Threshold (Bank 1)',
    system: 'Powertrain - Emissions',
    severity: 'Medium',
    commonCauses: ['Damaged catalytic converter', 'Faulty upstream/downstream O2 sensor', 'Exhaust manifold leak'],
    recommendedAction: 'Verify O2 sensor wave output using oscilloscope; inspect cat converter core for blockage.'
  },
  {
    code: 'P0171',
    title: 'System Too Lean (Bank 1)',
    system: 'Powertrain - Fuel Trim',
    severity: 'Medium',
    commonCauses: ['Dirty Mass Air Flow (MAF) sensor', 'Intake manifold vacuum leak', 'Weak fuel pump'],
    recommendedAction: 'Clean MAF sensor with approved spray, smoke-test intake manifold for vacuum leaks.'
  },
  {
    code: 'P0128',
    title: 'Coolant Thermostat Temperature Below Regulating Spec',
    system: 'Powertrain - Cooling',
    severity: 'Low',
    commonCauses: ['Stuck-open engine thermostat', 'Faulty engine coolant temperature (ECT) sensor'],
    recommendedAction: 'Check thermostat opening temp with thermal camera; replace thermostat assembly.'
  },
  {
    code: 'P0455',
    title: 'Evaporative Emission (EVAP) System Gross Leak Detected',
    system: 'Powertrain - EVAP Emissions',
    severity: 'Low',
    commonCauses: ['Loose or missing fuel tank filler cap', 'Defective EVAP purge valve', 'Cracked canister hose'],
    recommendedAction: 'Perform EVAP smoke test; inspect gas cap seal and EVAP purge solenoid valve.'
  },
  {
    code: 'P0700',
    title: 'Transmission Control System Malfunction (MIL Request)',
    system: 'Transmission / Drivetrain',
    severity: 'Critical',
    commonCauses: ['TCM communication fault', 'Low transmission fluid level', 'Faulty shift solenoid'],
    recommendedAction: 'Scan TCM module for sub-codes; inspect transmission fluid condition and level.'
  },
  {
    code: 'C0035',
    title: 'Left Front Wheel Speed Sensor Circuit Fault',
    system: 'Chassis - ABS / Traction Control',
    severity: 'Critical',
    commonCauses: ['Damaged wheel speed sensor wiring harness', 'Cracked magnetic tone ring', 'Failed ABS sensor'],
    recommendedAction: 'Check sensor resistance with DMM, inspect tone ring teeth, inspect harness for abrasion.'
  },
  {
    code: 'B0001',
    title: 'Driver Frontal Airbag Stage 1 Deployment Control',
    system: 'Body - SRS Restraint System',
    severity: 'Critical',
    commonCauses: ['Defective clockspring spiral cable', 'High resistance in airbag squib circuit'],
    recommendedAction: 'Test steering wheel clockspring continuity; inspect SRS yellow harness connections.'
  },
  {
    code: 'U0100',
    title: 'Lost Communication with Engine Control Module (ECM/PCM)',
    system: 'Network - CAN Bus High Speed',
    severity: 'Critical',
    commonCauses: ['CAN high/low short circuit', 'Blown ECM power fuse', 'Corroded ground lug'],
    recommendedAction: 'Measure CAN bus resistance at OBD port pin 6 & 14 (expect 60 ohms); verify ECM power & ground.'
  },
  {
    code: 'P0500',
    title: 'Vehicle Speed Sensor (VSS) "A" Malfunction',
    system: 'Powertrain - Speed & Cruise',
    severity: 'Medium',
    commonCauses: ['Defective output speed sensor', 'Damaged transmission speed sensor wiring'],
    recommendedAction: 'Check AC voltage output from VSS while spinning driven wheels on lift.'
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-01',
    vin: '1FTFW1E84KFA92811',
    make: 'Ford',
    model: 'F-150 SuperCrew Lariat',
    year: 2022,
    licensePlate: '7ABC892',
    mileage: 48250,
    lastServiceMileage: 42000,
    nextServiceDate: '2026-10-15',
    lastServiceDate: '2026-05-10',
    ownerName: 'Apex Logistics Inc.',
    ownerPhone: '(555) 382-9102',
    ownerEmail: 'fleet@apexlogistics.com',
    fuelType: 'Gasoline',
    status: 'In Service',
    color: 'Oxford White',
    notes: 'Primary regional distribution truck. Priority maintenance fleet contract.'
  },
  {
    id: 'veh-02',
    vin: '5YJ3E1EB8LF819204',
    make: 'Tesla',
    model: 'Model 3 Long Range AWD',
    year: 2023,
    licensePlate: 'EV-8849',
    mileage: 31400,
    lastServiceMileage: 25000,
    nextServiceDate: '2026-11-01',
    lastServiceDate: '2026-06-12',
    ownerName: 'Marcus Vance',
    ownerPhone: '(555) 749-2184',
    ownerEmail: 'marcus.vance@techcorp.io',
    fuelType: 'Electric',
    status: 'Operational',
    color: 'Midnight Silver Metallic',
    notes: 'Owner requests tire tread check and cabin HEPA filter replacement.'
  },
  {
    id: 'veh-03',
    vin: '4T1C11AK8PU621980',
    make: 'Toyota',
    model: 'RAV4 Hybrid XSE',
    year: 2021,
    licensePlate: '6XYZ411',
    mileage: 62800,
    lastServiceMileage: 58000,
    nextServiceDate: '2026-09-28',
    lastServiceDate: '2026-04-18',
    ownerName: 'Sarah Montgomery',
    ownerPhone: '(555) 891-3419',
    ownerEmail: 'smontgomery@gmail.com',
    fuelType: 'Hybrid',
    status: 'Critical Fault',
    color: 'Magnetic Gray',
    notes: 'Check Engine Light flashing with violent shaking at idle.'
  },
  {
    id: 'veh-04',
    vin: '1GCHY9EJ3M1732001',
    make: 'Chevrolet',
    model: 'Silverado 1500 RST',
    year: 2021,
    licensePlate: '9TRK503',
    mileage: 74120,
    lastServiceMileage: 69000,
    nextServiceDate: '2026-10-05',
    lastServiceDate: '2026-05-20',
    ownerName: 'Canyon Ridge Contractors',
    ownerPhone: '(555) 441-9021',
    ownerEmail: 'ops@canyonridge.build',
    fuelType: 'Gasoline',
    status: 'In Service',
    color: 'Shadow Gray Metallic',
    notes: 'Heavy towing duty. Transmission fluid and brake inspection required.'
  },
  {
    id: 'veh-05',
    vin: 'WBA5R1C56NFP39112',
    make: 'BMW',
    model: '330i xDrive M Sport',
    year: 2022,
    licensePlate: 'M-PWR77',
    mileage: 28900,
    lastServiceMileage: 20000,
    nextServiceDate: '2026-12-10',
    lastServiceDate: '2026-03-05',
    ownerName: 'Julian Sterling',
    ownerPhone: '(555) 238-1904',
    ownerEmail: 'jsterling@auroraventures.com',
    fuelType: 'Gasoline',
    status: 'Attention Needed',
    color: 'Portimao Blue',
    notes: 'ABS and traction control warning light illuminated intermittently.'
  },
  {
    id: 'veh-06',
    vin: '4UZAA2AK3KC612984',
    make: 'Mercedes-Benz',
    model: 'Sprinter 2500 High Roof Cargo',
    year: 2020,
    licensePlate: 'CARGO-19',
    mileage: 118400,
    lastServiceMileage: 110000,
    nextServiceDate: '2026-09-25',
    lastServiceDate: '2026-03-14',
    ownerName: 'FastTrack Courier Co.',
    ownerPhone: '(555) 902-8311',
    ownerEmail: 'dispatch@fasttrackdelivery.com',
    fuelType: 'Diesel',
    status: 'Operational',
    color: 'Arctic White',
    notes: 'High-mileage express delivery van. Diesel particulate filter (DPF) check.'
  }
];

export const INITIAL_TECHNICIANS: Technician[] = [
  {
    id: 'tech-01',
    name: 'Marcus Vance',
    specialty: 'Master Diagnostic & Engine Electronics',
    activeJobsCount: 2,
    completedThisMonth: 18,
    rating: 4.9,
    status: 'On Job',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-02',
    name: 'Sarah Chen',
    specialty: 'Hybrid Powertrains & High-Voltage EV',
    activeJobsCount: 1,
    completedThisMonth: 21,
    rating: 5.0,
    status: 'On Job',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-03',
    name: 'Elena Rostova',
    specialty: 'Transmissions & Drivetrain Hydraulics',
    activeJobsCount: 1,
    completedThisMonth: 15,
    rating: 4.8,
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'tech-04',
    name: 'David Kim',
    specialty: 'Brakes, Suspension & ADAS Calibration',
    activeJobsCount: 1,
    completedThisMonth: 19,
    rating: 4.9,
    status: 'On Job',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_TICKETS: FaultTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'FLT-4821',
    vehicleId: 'veh-03',
    vehicleVin: '4T1C11AK8PU621980',
    vehicleName: '2021 Toyota RAV4 Hybrid XSE',
    reportedDate: '2026-09-18 08:30',
    reportedBy: 'Sarah Montgomery (Owner)',
    severity: 'Critical',
    faultTitle: 'Engine Misfire with Check Engine Light Flashing',
    faultDescription: 'Vehicle shakes violently upon cold start and under light acceleration. Check Engine Light flashes repeatedly with loss of hybrid assist power.',
    dtcCodes: ['P0300', 'P0171'],
    symptoms: ['Check Engine Light Flashing', 'Rough Idle / Shaking', 'Reduced Engine Power', 'Fuel Odor'],
    stage: 'In Inspection',
    assignedTechnicianId: 'tech-01',
    assignedTechnicianName: 'Marcus Vance',
    odometerAtFault: 62800,
    photos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
    ],
    notes: [
      {
        id: 'note-1',
        authorName: 'Marcus Vance',
        authorRole: 'Master Diagnostic Tech',
        timestamp: '2026-09-18 10:15',
        noteText: 'Hooked up Snap-on scanner. Live data stream shows high fuel trim (+24%) on Bank 1 and cylinder 3 misfire count spiking. Initiating smoke test on vacuum lines.'
      },
      {
        id: 'note-2',
        authorName: 'Marcus Vance',
        authorRole: 'Master Diagnostic Tech',
        timestamp: '2026-09-18 14:20',
        noteText: 'Smoke test revealed cracked PCV hose assembly causing major unmetered air draw. Ignition coil on cyl 3 also exhibits high primary resistance.'
      }
    ],
    parts: [
      {
        id: 'part-1',
        partName: 'OEM PCV Breather Hose Assembly',
        partNumber: '12204-25010',
        quantity: 1,
        unitCost: 5800,
        totalCost: 5800,
        supplier: 'Toyota OEM Wholesale',
        status: 'Ordered'
      },
      {
        id: 'part-2',
        partName: 'Denso Direct Ignition Coil (Cyl 3)',
        partNumber: '90919-02258',
        quantity: 1,
        unitCost: 9500,
        totalCost: 9500,
        supplier: 'Denso North America',
        status: 'Ordered'
      },
      {
        id: 'part-3',
        partName: 'Iridium Spark Plug Set (x4)',
        partNumber: 'IKBH20TT',
        quantity: 4,
        unitCost: 1450,
        totalCost: 5800,
        supplier: 'Denso North America',
        status: 'In Stock'
      }
    ],
    laborHours: 2.5,
    laborHourlyRate: 1200,
    estimatedCompletionDate: '2026-09-21'
  },
  {
    id: 'tkt-102',
    ticketNumber: 'FLT-4822',
    vehicleId: 'veh-01',
    vehicleVin: '1FTFW1E84KFA92811',
    vehicleName: '2022 Ford F-150 SuperCrew',
    reportedDate: '2026-09-16 14:15',
    reportedBy: 'Apex Fleet Dispatch',
    severity: 'Medium',
    faultTitle: 'Catalytic Converter Efficiency Below Threshold',
    faultDescription: 'Exhaust sulfur smell detected after heavy highway towing. Steady amber malfunction indicator light illuminated on dashboard.',
    dtcCodes: ['P0420'],
    symptoms: ['Check Engine Light Solid', 'Exhaust Odor', 'Decreased Fuel Economy'],
    stage: 'Parts Ordered',
    assignedTechnicianId: 'tech-03',
    assignedTechnicianName: 'Elena Rostova',
    odometerAtFault: 48250,
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80'
    ],
    notes: [
      {
        id: 'note-3',
        authorName: 'Elena Rostova',
        authorRole: 'Drivetrain Tech',
        timestamp: '2026-09-17 09:00',
        noteText: 'Inspected downstream heated O2 sensor signal with PicoScope. Graph mirrors upstream sensor exactly, confirming catalytic converter honeycomb matrix degradation.'
      }
    ],
    parts: [
      {
        id: 'part-4',
        partName: 'Direct-Fit Catalytic Converter Assembly (Bank 1)',
        partNumber: 'JL3Z-5E212-D',
        quantity: 1,
        unitCost: 68000,
        totalCost: 68000,
        supplier: 'Motorcraft Parts Depot',
        status: 'Ordered'
      },
      {
        id: 'part-5',
        partName: 'Downstream Heated O2 Sensor',
        partNumber: 'DY-1422',
        quantity: 1,
        unitCost: 7500,
        totalCost: 7500,
        supplier: 'Motorcraft Parts Depot',
        status: 'In Stock'
      }
    ],
    laborHours: 3.0,
    laborHourlyRate: 1200,
    estimatedCompletionDate: '2026-09-23'
  },
  {
    id: 'tkt-103',
    ticketNumber: 'FLT-4823',
    vehicleId: 'veh-05',
    vehicleVin: 'WBA5R1C56NFP39112',
    vehicleName: '2022 BMW 330i xDrive',
    reportedDate: '2026-09-19 11:20',
    reportedBy: 'Julian Sterling (Owner)',
    severity: 'Critical',
    faultTitle: 'ABS & Dynamic Stability Control Malfunction',
    faultDescription: 'Brake pedal vibrates slightly under ordinary dry braking. Instrument cluster warns "Chassis stabilization restricted. Drive moderately".',
    dtcCodes: ['C0035'],
    symptoms: ['ABS Warning Light', 'Traction Control Light', 'Brake Pedal Pulsation'],
    stage: 'In Repair',
    assignedTechnicianId: 'tech-04',
    assignedTechnicianName: 'David Kim',
    odometerAtFault: 28900,
    photos: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80'
    ],
    notes: [
      {
        id: 'note-4',
        authorName: 'David Kim',
        authorRole: 'Chassis & Brake Specialist',
        timestamp: '2026-09-19 13:45',
        noteText: 'Left front wheel speed sensor wiring harness was chafed against control arm bracket due to detached retaining clip. Sensor circuit reading open.'
      },
      {
        id: 'note-5',
        authorName: 'David Kim',
        authorRole: 'Chassis & Brake Specialist',
        timestamp: '2026-09-20 08:30',
        noteText: 'Replacing LF ABS speed sensor harness assembly now. Will test drive and calibrate DSC sensor zero-point.'
      }
    ],
    parts: [
      {
        id: 'part-6',
        partName: 'Front Left Wheel Speed Sensor Harness',
        partNumber: '34-52-6-869-321',
        quantity: 1,
        unitCost: 11200,
        totalCost: 11200,
        supplier: 'BMW Genuine Parts',
        status: 'Installed'
      }
    ],
    laborHours: 2.0,
    laborHourlyRate: 1400,
    estimatedCompletionDate: '2026-09-20'
  },
  {
    id: 'tkt-104',
    ticketNumber: 'FLT-4824',
    vehicleId: 'veh-04',
    vehicleVin: '1GCHY9EJ3M1732001',
    vehicleName: '2021 Chevrolet Silverado 1500',
    reportedDate: '2026-09-17 16:00',
    reportedBy: 'Canyon Ridge Dispatch',
    severity: 'Low',
    faultTitle: 'EVAP Gross Leak - Loose Filler Neck / Purge Solenoid',
    faultDescription: 'Driver tightened gas cap twice but "Tighten Gas Cap" and Check Engine Light remain on.',
    dtcCodes: ['P0455'],
    symptoms: ['Check Engine Light Solid', 'EVAP Warning Message'],
    stage: 'Ready for Pickup',
    assignedTechnicianId: 'tech-01',
    assignedTechnicianName: 'Marcus Vance',
    odometerAtFault: 74120,
    photos: [],
    notes: [
      {
        id: 'note-6',
        authorName: 'Marcus Vance',
        authorRole: 'Master Diagnostic Tech',
        timestamp: '2026-09-18 11:00',
        noteText: 'Found EVAP canister vent valve stuck in open position due to fine construction dust intrusion. Cleaned vapor lines and replaced vent valve assembly.'
      },
      {
        id: 'note-7',
        authorName: 'Marcus Vance',
        authorRole: 'Master Diagnostic Tech',
        timestamp: '2026-09-19 15:30',
        noteText: 'Passed OBD-II EVAP service bay leak test with 0.020" orifice pass. MIL light extinguished, road test completed.'
      }
    ],
    parts: [
      {
        id: 'part-7',
        partName: 'ACDelco Vapor Canister Vent Valve',
        partNumber: '23481275',
        quantity: 1,
        unitCost: 4500,
        totalCost: 4500,
        supplier: 'ACDelco GM Original',
        status: 'Installed'
      }
    ],
    laborHours: 1.5,
    laborHourlyRate: 1200,
    completedDate: '2026-09-19 16:00'
  },
  {
    id: 'tkt-105',
    ticketNumber: 'FLT-4825',
    vehicleId: 'veh-06',
    vehicleVin: '4UZAA2AK3KC612984',
    vehicleName: '2020 Mercedes-Benz Sprinter 2500',
    reportedDate: '2026-09-20 07:10',
    reportedBy: 'FastTrack Delivery Fleet',
    severity: 'Critical',
    faultTitle: 'Transmission Slipping & Hard 2-3 Upshift',
    faultDescription: 'Van hesitates significantly when pulling onto highway with full cargo load. Transmission temperature gauge reading high.',
    dtcCodes: ['P0700', 'P0500'],
    symptoms: ['Transmission Slipping', 'Delayed Gear Engagement', 'High Trans Temp Warning'],
    stage: 'Fault Reported',
    odometerAtFault: 118400,
    photos: [],
    notes: [],
    parts: [],
    laborHours: 1.0,
    laborHourlyRate: 1400,
    estimatedCompletionDate: '2026-09-24'
  },
  {
    id: 'tkt-106',
    ticketNumber: 'FLT-4820',
    vehicleId: 'veh-02',
    vehicleVin: '5YJ3E1EB8LF819204',
    vehicleName: '2023 Tesla Model 3 Long Range',
    reportedDate: '2026-09-14 09:30',
    reportedBy: 'Marcus Vance',
    severity: 'Low',
    faultTitle: 'High-Voltage Battery Coolant Temperature Sensor Calibration',
    faultDescription: 'Supercharging rate capped at 65kW; dashboard diagnostic screen noted thermal conditioning anomaly.',
    dtcCodes: ['P0128'],
    symptoms: ['Slow Supercharging', 'Active Thermal Fan Noise'],
    stage: 'Completed',
    assignedTechnicianId: 'tech-02',
    assignedTechnicianName: 'Sarah Chen',
    odometerAtFault: 31200,
    photos: [],
    notes: [
      {
        id: 'note-8',
        authorName: 'Sarah Chen',
        authorRole: 'EV Specialist',
        timestamp: '2026-09-14 14:00',
        noteText: 'Purged coolant air bubble using Tesla Toolbox diagnostic software. Re-calibrated chiller expansion valve. Supercharge test confirmed 245kW peak rate restored.'
      }
    ],
    parts: [
      {
        id: 'part-8',
        partName: 'Tesla G-48 Ethylene Glycol Coolant (5L)',
        partNumber: '1029490-00-A',
        quantity: 1,
        unitCost: 3800,
        totalCost: 3800,
        supplier: 'Tesla Service Supply',
        status: 'Installed'
      }
    ],
    laborHours: 2.0,
    laborHourlyRate: 1500,
    completedDate: '2026-09-15 17:00'
  }
];

export const INITIAL_SCHEDULES: ServiceSchedule[] = [
  {
    id: 'sch-01',
    scheduleNumber: 'SVC-2940',
    vehicleId: 'veh-03',
    vehicleVin: '4T1C11AK8PU621980',
    vehicleName: 'Toyota RAV4 Hybrid XSE',
    serviceType: 'Scheduled 60,000 Mile Overhaul',
    scheduledDate: '2026-09-28',
    priority: 'Urgent',
    status: 'Scheduled',
    estimatedDurationHours: 3.5,
    estimatedCost: 32000,
    assignedTechnician: 'Sarah Chen',
    notes: 'Major 60k interval: Inverter coolant check, spark plugs, transaxle fluid, brake flush.'
  },
  {
    id: 'sch-02',
    scheduleNumber: 'SVC-2941',
    vehicleId: 'veh-06',
    vehicleVin: '4UZAA2AK3KC612984',
    vehicleName: 'Mercedes-Benz Sprinter 2500',
    serviceType: 'Oil & Filter Change',
    scheduledDate: '2026-09-25',
    priority: 'Normal',
    status: 'Scheduled',
    estimatedDurationHours: 1.5,
    estimatedCost: 6500,
    assignedTechnician: 'Elena Rostova',
    notes: '12-quart synthetic 229.52 diesel oil, OEM fleece filter, fuel filter water separator drain.'
  },
  {
    id: 'sch-03',
    scheduleNumber: 'SVC-2942',
    vehicleId: 'veh-04',
    vehicleVin: '1GCHY9EJ3M1732001',
    vehicleName: 'Chevrolet Silverado 1500',
    serviceType: 'Transmission Fluid Service',
    scheduledDate: '2026-10-05',
    priority: 'Normal',
    status: 'Scheduled',
    estimatedDurationHours: 2.0,
    estimatedCost: 18500,
    assignedTechnician: 'Elena Rostova',
    notes: 'Full Dexron-VI flush and transmission pan filter replacement.'
  },
  {
    id: 'sch-04',
    scheduleNumber: 'SVC-2943',
    vehicleId: 'veh-01',
    vehicleVin: '1FTFW1E84KFA92811',
    vehicleName: 'Ford F-150 SuperCrew',
    serviceType: 'Comprehensive Brake Inspection',
    scheduledDate: '2026-10-15',
    priority: 'Normal',
    status: 'Scheduled',
    estimatedDurationHours: 2.0,
    estimatedCost: 12000,
    assignedTechnician: 'David Kim',
    notes: 'Rotor runout measurement, ceramic brake pad thickness test, caliper slide lube.'
  },
  {
    id: 'sch-05',
    scheduleNumber: 'SVC-2944',
    vehicleId: 'veh-02',
    vehicleVin: '5YJ3E1EB8LF819204',
    vehicleName: 'Tesla Model 3 Long Range',
    serviceType: 'Tire Rotation & Balance',
    scheduledDate: '2026-11-01',
    priority: 'Normal',
    status: 'Scheduled',
    estimatedDurationHours: 1.0,
    estimatedCost: 2500,
    assignedTechnician: 'David Kim',
    notes: 'Road-force balancing, tire tread depth mapping across all 4 wheels.'
  }
];
