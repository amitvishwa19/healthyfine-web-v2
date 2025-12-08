'use client'
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { appointmentStatus, APPOINTMENTTYPE, hospitalDefaultSettings } from '@/utils/types'
import { ROLE } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Loader, Mic, Play, Save, Square, SquarePause } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { DatePicker } from '@/components/global/DatePicker'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import moment from 'moment'
import { useAction } from '@/hooks/use-action'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { newAppointment } from '../_actions/new-appointment'
import { useOrg } from '@/providers/OrgProvider'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage, } from "@/components/ui/avatar"
import { useModal } from '@/hooks/useModal'
import { DynamicIcon } from 'lucide-react/dynamic';
import { ScrollArea } from '@/components/ui/scroll-area'
import { setAppointments } from '../_redux/appointment-slice'
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from "@/components/ui/calendar";
import { updateAppointment } from '../_actions/update-appointment'
import NewAppointmentManager from '../_components/NewAppointmentManager'

const appointmentSchema = z.object({
    doctorId: z.string().trim().nonempty({ message: "Please select a doctor" }),
    patientId: z.string().trim().nonempty({ message: "Please select a patient" }),
    serverId: z.string().trim().nonempty({ message: "Please select a server" }),
    date: z.string().nonempty({ message: "Please select an appointment date" }),
    slot: z.any().refine(val => val !== undefined && val !== null, { message: "Please select a slot" }),
    time: z.string().trim().nonempty({ message: "Please select an appointment time" }),
    type: z.object({
        type: z.string(),
        status: z.boolean(),
        charge: z.number(),
        icon: z.string()
    }),
    status: z.any(),
    note: z.string().optional(),
    additionalNote: z.string().optional(),
    doctorNote: z.string().optional(),
});

export default function NewAppointmentPage() {
    const { data: session } = useSession()
    const params = useParams()
    const { orgId } = params
    const { server, servers, users, refreshServer } = useOrg()
    const dispatch = useDispatch()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [listning, setListning] = useState(false)
    const [pauseListning, setPauseListning] = useState(false)
    const { isOpen, onOpen, onClose, type: modalType, data: mData } = useModal();
    const isModalOpen = isOpen && modalType === "appointment-crud";
    const isEditMode = modalType === 'edit';

    const [doctor, setDoctor] = useState({})
    const [slot, setSlot] = useState({ slot: 'morning', start: '09:00 AM', end: '01:00 PM', avaliable: false })
    const [slotTimes, setSlotTimes] = useState([])
    const [time, setTime] = useState(null)
    const [type, setType] = useState({ type: 'clinic', status: false, charge: 250, icon: 'hospital' })
    const options = doctor?.setting?.consultationOptions ? doctor?.setting?.consultationOptions : hospitalDefaultSettings?.consultationOptions
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate())
    yesterday.setHours(0, 0, 0, 0) // normalize time


    const form = useForm({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            doctorId: server?.userId,
            patientId: "",
            serverId: orgId || "",
            date: moment().format(),
            slot: hospitalDefaultSettings?.timing[0],
            time: "",
            type: { type: 'clinic', status: false, charge: 250, icon: 'hospital' },
            note: "",
            additionalNote: "",
            doctorNote: "",
            additionalNote: "",
            doctorNote: "",
            status: "scheduled"
        }
    });

    useEffect(() => {
        if (session) {
            setDoctor(server)
        }
    }, [server])


    useEffect(() => {

        const times = [];
        const startTime = form?.getValues('slot')?.start || '09:00 AM';
        const endTime = form?.getValues('slot')?.end || '12:00 PM';
        const interval = 15 || 15;


        // Helper to convert 12-hour time to minutes
        const toMinutes = (timeStr) => {
            const [time, modifier] = timeStr?.split(' ');
            let [hours, minutes] = time?.split(':').map(Number);
            if (modifier === 'PM' && hours !== 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        };

        // Helper to convert minutes back to 12-hour time
        const toTimeString = (totalMinutes) => {
            let hours = Math.floor(totalMinutes / 60);
            let minutes = totalMinutes % 60;
            const modifier = hours >= 12 ? 'PM' : 'AM';

            let displayHour = hours % 12;
            if (displayHour === 0) displayHour = 12; // midnight & noon fix


            if (hours === 0) hours = 12;
            if (hours > 12) hours -= 12;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${modifier}`;
        };

        let start = toMinutes(startTime);
        const end = toMinutes(endTime);

        while (start < end) {
            times.push(toTimeString(start));
            start += interval;
        }
        setSlotTimes(times)


    }, [form, slot])

    function parseTime(t) {
        const [time, modifier] = t.split(" ");
        let [hours, minutes] = time.split(":");

        hours = parseInt(hours, 10);
        minutes = parseInt(minutes, 10);

        // Convert to 24-hour format
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;

        // Create date object for today with given time
        const now = new Date();
        const compareTime = new Date();
        compareTime.setHours(hours, minutes, 0, 0);

        return compareTime < now && (moment().format('DD') === moment(form.getValues('date')).format('DD'));
    }

    function futureDate() {
        const dateString = "2025-12-02T00:00:00+05:30"
        const targetDate = new Date(form.getValues('date'))
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to compare only dates
        targetDate.setHours(0, 0, 0, 0) // Reset time for clean comparison
        return targetDate > today

    }

    // ------------------------------------Voice note-------------------------------------------
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        //setAppointmentData({ ...appointmentData, note: transcript })
        console.log('transcript', transcript, listening)
    }, [transcript, listening])

    console.log('transcript', transcript)

    const startListning = () => {
        setListning(!listning)
        SpeechRecognition.startListening({ continuous: true, language: 'en-IN' })
    }

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    // ------------------------------------Voice note-------------------------------------------




    const { execute } = useAction(newAppointment, {
        onSuccess: (data) => {
            setLoading(false)
            refreshServer().then((e) => {
                console.log(e)
                toast.success('New appointment created successfully', { id: 'new-appointment' });
                router.push(`/workspace/${orgId}/appointment`)
            })
        },
        onError: (error) => {
            console.log(error)
            handleOpenChange()
            setLoading(false)
        }
    })


    function onSubmit(data) {
        toast.loading('Please wait while we are creating new appointment', { id: 'new-appointment' })
        execute({ data })
    }

    return (
        <div className='absolute inset-0 flex flex-col gap-2 p-2'>

            <div className='w-full dark:bg-[#151D24] p-4 rounded-md border flex flex-row items-center justify-between'>
                <div>
                    <h2 className='text-xl'>Book New Appointment</h2>
                    <h2 className='text-xs text-white/50'>One Click to Better Health – Book Your Appointment</h2>
                </div>

            </div>


            <div className='dark:bg-darkSecondaryBackground rounded-md border flex-1'>
                <ScrollArea className=' mt-0 p-4 flex flex-col gap-4 h-[85vh]  '>

                    <NewAppointmentManager />
                </ScrollArea>
            </div>




        </div >
    )
}
