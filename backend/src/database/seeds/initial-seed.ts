import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entities/user.entity';
import { Doctor, DoctorSpecialty } from '../../doctors/entities/doctor.entity';
import { Appointment, AppointmentType, AppointmentStatus } from '../../appointments/entities/appointment.entity';
import { QueueItem, QueueStatus, Priority } from '../../queue/entities/queue-item.entity';

export async function seedDatabase(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);
  const doctorRepository = dataSource.getRepository(Doctor);
  const appointmentRepository = dataSource.getRepository(Appointment);
  const queueRepository = dataSource.getRepository(QueueItem);

  // Create admin user
  const adminExists = await userRepository.findOne({ where: { email: 'admin@meddesk.com' } });
  if (!adminExists) {
    const admin = userRepository.create({
      email: 'admin@meddesk.com',
      firstName: 'Admin',
      lastName: 'User',
      password: 'admin123', // Let the @BeforeInsert hook handle hashing
      role: UserRole.ADMIN,
      phone: '+1234567890',
    });
    await userRepository.save(admin);
    console.log('✅ Admin user created');
  }

  // Create receptionist user
  const receptionistExists = await userRepository.findOne({ where: { email: 'receptionist@meddesk.com' } });
  if (!receptionistExists) {
    const receptionist = userRepository.create({
      email: 'receptionist@meddesk.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'receptionist123', // Let the @BeforeInsert hook handle hashing
      role: UserRole.RECEPTIONIST,
      phone: '+1234567891',
    });
    await userRepository.save(receptionist);
    console.log('✅ Receptionist user created');
  }

  // Create sample doctors
  const sampleDoctors = [
    {
      firstName: 'John',
      lastName: 'Wilson',
      email: 'dr.wilson@meddesk.com',
      licenseNumber: 'MD001234',
      specialty: DoctorSpecialty.GENERAL_PRACTICE,
      phone: '+1234567892',
      bio: 'Experienced general practitioner with over 15 years of experience.',
      consultationFee: 150.00,
      workingHours: {
        monday: { start: '09:00', end: '17:00', isWorking: true },
        tuesday: { start: '09:00', end: '17:00', isWorking: true },
        wednesday: { start: '09:00', end: '17:00', isWorking: true },
        thursday: { start: '09:00', end: '17:00', isWorking: true },
        friday: { start: '09:00', end: '17:00', isWorking: true },
        saturday: { start: '09:00', end: '13:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'dr.johnson@meddesk.com',
      licenseNumber: 'MD005678',
      specialty: DoctorSpecialty.CARDIOLOGY,
      phone: '+1234567893',
      bio: 'Board-certified cardiologist specializing in preventive cardiology.',
      consultationFee: 250.00,
      workingHours: {
        monday: { start: '08:00', end: '16:00', isWorking: true },
        tuesday: { start: '08:00', end: '16:00', isWorking: true },
        wednesday: { start: '08:00', end: '16:00', isWorking: true },
        thursday: { start: '08:00', end: '16:00', isWorking: true },
        friday: { start: '08:00', end: '14:00', isWorking: true },
        saturday: { start: '00:00', end: '00:00', isWorking: false },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'dr.brown@meddesk.com',
      licenseNumber: 'MD009012',
      specialty: DoctorSpecialty.PEDIATRICS,
      phone: '+1234567894',
      bio: 'Pediatrician with expertise in child development and family medicine.',
      consultationFee: 180.00,
      workingHours: {
        monday: { start: '10:00', end: '18:00', isWorking: true },
        tuesday: { start: '10:00', end: '18:00', isWorking: true },
        wednesday: { start: '10:00', end: '18:00', isWorking: true },
        thursday: { start: '10:00', end: '18:00', isWorking: true },
        friday: { start: '10:00', end: '16:00', isWorking: true },
        saturday: { start: '09:00', end: '12:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    }
  ];

  for (const doctorData of sampleDoctors) {
    const doctorExists = await doctorRepository.findOne({ where: { email: doctorData.email } });
    if (!doctorExists) {
      const doctor = doctorRepository.create(doctorData);
      await doctorRepository.save(doctor);
      console.log(`✅ Doctor ${doctorData.firstName} ${doctorData.lastName} created`);
    }
  }

  // Create sample appointments
  const doctors = await doctorRepository.find();
  if (doctors.length > 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sampleAppointments = [
      {
        patientName: 'John Doe',
        patientEmail: 'john.doe@email.com',
        patientPhone: '+1234567890',
        patientAddress: '123 Main St, City, State',
        dateOfBirth: '1985-05-15',
        appointmentDate: today,
        appointmentTime: '09:00',
        type: AppointmentType.CONSULTATION,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Regular checkup',
        notes: 'Patient reports feeling well',
        fee: 150,
        isPaid: false,
        doctorId: doctors[0].id,
      },
      {
        patientName: 'Jane Smith',
        patientEmail: 'jane.smith@email.com',
        patientPhone: '+1234567891',
        patientAddress: '456 Oak Ave, City, State',
        dateOfBirth: '1990-08-22',
        appointmentDate: today,
        appointmentTime: '10:30',
        type: AppointmentType.FOLLOW_UP,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Follow-up consultation',
        notes: 'Previous treatment follow-up',
        fee: 100,
        isPaid: true,
        doctorId: doctors[0].id,
      },
      {
        patientName: 'Mike Johnson',
        patientEmail: 'mike.johnson@email.com',
        patientPhone: '+1234567892',
        patientAddress: '789 Pine St, City, State',
        dateOfBirth: '1978-12-03',
        appointmentDate: tomorrow,
        appointmentTime: '14:00',
        type: AppointmentType.CONSULTATION,
        status: AppointmentStatus.SCHEDULED,
        reason: 'Chest pain evaluation',
        notes: 'Patient experiencing chest discomfort',
        fee: 200,
        isPaid: false,
        doctorId: doctors.length > 1 ? doctors[1].id : doctors[0].id,
      },
    ];

    for (const appointmentData of sampleAppointments) {
      const existingAppointment = await appointmentRepository.findOne({
        where: { 
          patientEmail: appointmentData.patientEmail,
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime
        }
      });
      
      if (!existingAppointment) {
        const appointment = appointmentRepository.create(appointmentData);
        await appointmentRepository.save(appointment);
      }
    }
    console.log('✅ Sample appointments created');
  }

  // Create sample queue items
  if (doctors.length > 0) {
    const sampleQueueItems = [
      {
        patientName: 'Alice Brown',
        patientPhone: '+1234567893',
        reason: 'Routine checkup',
        priority: Priority.NORMAL,
        status: QueueStatus.WAITING,
        queueNumber: 1,
        estimatedWaitTime: 15,
        doctorId: doctors[0].id,
      },
      {
        patientName: 'Bob Wilson',
        patientPhone: '+1234567894',
        reason: 'Blood pressure check',
        priority: Priority.NORMAL,
        status: QueueStatus.WAITING,
        queueNumber: 2,
        estimatedWaitTime: 30,
        doctorId: doctors[0].id,
      },
      {
        patientName: 'Carol Davis',
        patientPhone: '+1234567895',
        reason: 'Urgent consultation',
        priority: Priority.HIGH,
        status: QueueStatus.IN_PROGRESS,
        queueNumber: 3,
        estimatedWaitTime: 0,
        doctorId: doctors.length > 1 ? doctors[1].id : doctors[0].id,
      },
    ];

    for (const queueData of sampleQueueItems) {
      const existingQueueItem = await queueRepository.findOne({
        where: { 
          patientName: queueData.patientName
        }
      });
      
      if (!existingQueueItem) {
        const queueItem = queueRepository.create(queueData);
        await queueRepository.save(queueItem);
      }
    }
    console.log('✅ Sample queue items created');
  }

  console.log('🎉 Database seeding completed successfully!');
}
