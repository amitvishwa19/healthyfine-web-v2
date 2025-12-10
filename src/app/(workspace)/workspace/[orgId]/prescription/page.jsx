'use client'
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Clock, CheckCircle2, XCircle, Plus, Pill, } from 'lucide-react';
import { toast } from '@/hooks/useToast';
import { StatsCard } from './_components/StatsCard';
import { PrescriptionList } from './_components/PrescriptionList';
import { PrescriptionDetail } from './_components/PrescriptionDetai';
import { AddPrescriptionDialog } from './_components/AddPrescriptionDialog';


const setPatients = [
    { id: '1', name: 'John Smith', age: 45, gender: 'male', phone: '+1 234 567 8901', email: 'john.smith@email.com' },
    { id: '2', name: 'Sarah Johnson', age: 32, gender: 'female', phone: '+1 234 567 8902', email: 'sarah.j@email.com' },
    { id: '3', name: 'Michael Brown', age: 58, gender: 'male', phone: '+1 234 567 8903' },
    { id: '4', name: 'Emily Davis', age: 28, gender: 'female', phone: '+1 234 567 8904', email: 'emily.d@email.com' },
    { id: '5', name: 'Robert Wilson', age: 67, gender: 'male', phone: '+1 234 567 8905' },
];

const patients = [
    { id: '1', name: 'John Smith', age: 45, gender: 'male', phone: '+1 234 567 8901', email: 'john.smith@email.com' },
    { id: '2', name: 'Sarah Johnson', age: 32, gender: 'female', phone: '+1 234 567 8902', email: 'sarah.j@email.com' },
    { id: '3', name: 'Michael Brown', age: 58, gender: 'male', phone: '+1 234 567 8903' },
    { id: '4', name: 'Emily Davis', age: 28, gender: 'female', phone: '+1 234 567 8904', email: 'emily.d@email.com' },
    { id: '5', name: 'Robert Wilson', age: 67, gender: 'male', phone: '+1 234 567 8905' },
];

const doctors = [
    { id: '1', name: 'Dr. Amanda Chen', specialization: 'General Medicine', licenseNumber: 'MD-12345' },
    { id: '2', name: 'Dr. James Rodriguez', specialization: 'Cardiology', licenseNumber: 'MD-12346' },
    { id: '3', name: 'Dr. Lisa Thompson', specialization: 'Pediatrics', licenseNumber: 'MD-12347' },
];

export const mockPrescriptions = [
    {
        id: '1',
        prescriptionNumber: 'RX-2024-001',
        patient: patients[0],
        doctor: doctors[0],
        medications: [
            { id: '1', name: 'Amoxicillin', dosage: '500mg', frequency: 'Three times daily', duration: '7 days', instructions: 'Take with food' },
            { id: '2', name: 'Ibuprofen', dosage: '400mg', frequency: 'As needed', duration: '5 days', instructions: 'Max 3 times daily' },
        ],
        diagnosis: 'Upper respiratory tract infection',
        notes: 'Patient should rest and stay hydrated',
        status: 'pending',
        createdAt: new Date('2024-12-09T10:30:00'),
        updatedAt: new Date('2024-12-09T10:30:00'),
    },
    {
        id: '2',
        prescriptionNumber: 'RX-2024-002',
        patient: patients[1],
        doctor: doctors[1],
        medications: [
            { id: '3', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
            { id: '4', name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: '30 days' },
        ],
        diagnosis: 'Hypertension',
        status: 'dispensed',
        createdAt: new Date('2024-12-08T14:15:00'),
        updatedAt: new Date('2024-12-08T16:00:00'),
        dispensedAt: new Date('2024-12-08T16:00:00'),
    },
    {
        id: '3',
        prescriptionNumber: 'RX-2024-003',
        patient: patients[2],
        doctor: doctors[0],
        medications: [
            { id: '5', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days', instructions: 'Take with meals' },
        ],
        diagnosis: 'Type 2 Diabetes',
        notes: 'Monitor blood sugar levels regularly',
        status: 'dispensed',
        createdAt: new Date('2024-12-07T09:00:00'),
        updatedAt: new Date('2024-12-07T11:30:00'),
        dispensedAt: new Date('2024-12-07T11:30:00'),
    },
    {
        id: '4',
        prescriptionNumber: 'RX-2024-004',
        patient: patients[3],
        doctor: doctors[2],
        medications: [
            { id: '6', name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '14 days', instructions: 'Take before breakfast' },
        ],
        diagnosis: 'Gastroesophageal reflux disease',
        status: 'pending',
        createdAt: new Date('2024-12-09T08:45:00'),
        updatedAt: new Date('2024-12-09T08:45:00'),
    },
    {
        id: '5',
        prescriptionNumber: 'RX-2024-005',
        patient: patients[4],
        doctor: doctors[1],
        medications: [
            { id: '7', name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take at bedtime' },
            { id: '8', name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '30 days' },
        ],
        diagnosis: 'Hyperlipidemia, Atrial fibrillation',
        notes: 'Schedule follow-up in 2 weeks',
        status: 'cancelled',
        createdAt: new Date('2024-12-06T13:20:00'),
        updatedAt: new Date('2024-12-06T15:00:00'),
    },
];

export const getPatients = () => patients;
export const getDoctors = () => doctors;


export default function PrescriptionPage() {
    const [prescriptions, setPrescriptions] = useState(mockPrescriptions);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const stats = {
        total: prescriptions.length,
        pending: prescriptions.filter((p) => p.status === 'pending').length,
        dispensed: prescriptions.filter((p) => p.status === 'dispensed').length,
        cancelled: prescriptions.filter((p) => p.status === 'cancelled').length,
    };

    const handleViewPrescription = (prescription) => {
        setSelectedPrescription(prescription);
        setDetailOpen(true);
    };

    const handleStatusChange = (id) => {
        setPrescriptions((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                        ...p,
                        status,
                        updatedAt: new Date(),
                        dispensedAt: status === 'dispensed' ? new Date() : p.dispensedAt,
                    }
                    : p
            )
        );
        setDetailOpen(false);
        toast({
            title: status === 'dispensed' ? 'Prescription Dispensed' : 'Prescription Cancelled',
            description: `Prescription has been marked as ${status}`,
        });
    };

    const handleAddPrescription = (
        newPrescription
    ) => {
        const now = new Date();
        const prescription = {
            ...newPrescription,
            id: `${prescriptions.length + 1}`,
            prescriptionNumber: `RX-2024-${String(prescriptions.length + 1).padStart(3, '0')}`,
            createdAt: now,
            updatedAt: now,
        };
        setPrescriptions((prev) => [prescription, ...prev]);
        toast({
            title: 'Prescription Created',
            description: `${prescription.prescriptionNumber} has been created successfully`,
        });
    };

    return (
        <div className='absolute inset-0 flex flex-col gap-2 p-2'>

            <div className='w-full dark:bg-darkSecondaryBackground  p-4 rounded-lg border flex flex-row items-center justify-between'>
                <div>
                    <h2 className='text-xl'>Prescription Management</h2>
                    <h2 className='text-xs text-muted-foreground'>Digital Prescriptions: Doctors create Rx with dosage, frequency, duration, and instructions</h2>
                </div>
                <div>
                    <Button variant='outline' size='sm' onClick={() => setAddDialogOpen(true)}>
                        Add Prescription
                    </Button>
                </div>
            </div>

            <ScrollArea className='h-[85vh] flex flex-grow dark:bg-darkSecondaryBackground p-2 rounded-md pr-4'>

                <main className="">
                    {/* Stats Section */}
                    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatsCard
                            title="Total Prescriptions"
                            value={stats.total}
                            description="All time"
                            icon={FileText}
                            iconClassName="bg-primary/10 text-primary"
                        />
                        <StatsCard
                            title="Pending"
                            value={stats.pending}
                            description="Awaiting dispensing"
                            icon={Clock}
                            iconClassName="bg-warning/10 text-warning"
                        />
                        <StatsCard
                            title="Dispensed"
                            value={stats.dispensed}
                            description="Completed"
                            icon={CheckCircle2}
                            iconClassName="bg-success/10 text-success"
                        />
                        <StatsCard
                            title="Cancelled"
                            value={stats.cancelled}
                            description="Void prescriptions"
                            icon={XCircle}
                            iconClassName="bg-destructive/10 text-destructive"
                        />
                    </section>

                    {/* Prescriptions List */}
                    <section className="space-y-4">

                        <PrescriptionList
                            prescriptions={prescriptions}
                            onView={handleViewPrescription}
                        />
                    </section>
                </main>
                {/* Prescription Detail Dialog */}
                <PrescriptionDetail
                    prescription={selectedPrescription}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                    onStatusChange={handleStatusChange}
                />

                {/* Add Prescription Dialog */}
                <AddPrescriptionDialog
                    open={addDialogOpen}
                    onOpenChange={setAddDialogOpen}
                    onAdd={handleAddPrescription}
                />

            </ScrollArea>

        </div >
    )
}
