import React from 'react'
import { Clock, User, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const appointments = [
    {
        id: "1",
        patientName: "Sarah Johnson",
        patientInitials: "SJ",
        time: "09:00 AM",
        type: "General Checkup",
        status: "confirmed",
    },
    {
        id: "2",
        patientName: "Michael Chen",
        patientInitials: "MC",
        time: "10:30 AM",
        type: "Dental Cleaning",
        status: "pending",
    },
    {
        id: "3",
        patientName: "Emily Davis",
        patientInitials: "ED",
        time: "11:45 AM",
        type: "Follow-up",
        status: "confirmed",
    },
    {
        id: "4",
        patientName: "James Wilson",
        patientInitials: "JW",
        time: "02:00 PM",
        type: "Consultation",
        status: "pending",
    },
    {
        id: "5",
        patientName: "Lisa Anderson",
        patientInitials: "LA",
        time: "03:30 PM",
        type: "X-Ray Review",
        status: "confirmed",
    },
    {
        id: "6",
        patientName: "Lisa Anderson",
        patientInitials: "LA",
        time: "03:30 PM",
        type: "X-Ray Review",
        status: "confirmed",
    },
];

const statusStyles = {
    confirmed: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    completed: "bg-muted text-muted-foreground border-muted",
};


export default function AppointmentsList() {
    return (
        <div className="rounded-xl border border-border/50 bg-card dark:bg-darkSecondaryBackground shadow-card animate-slide-up" style={{ animationDelay: "200ms" }}>

            <div className="flex items-center justify-between border-b border-border/50 p-5">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Today's Appointments</h3>
                    <p className="text-sm text-muted-foreground">5 appointments scheduled</p>
                </div>
                <Button variant="outline" size="sm">
                    View All
                </Button>
            </div>

            <div className="divide-y divide-border/50">
                {appointments.map((appointment, index) => (
                    <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-accent/30"
                    >
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border-2 border-border/50">
                                <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">
                                    {appointment.patientInitials}
                                </AvatarFallback>
                            </Avatar>

                            <div>
                                <p className="font-medium text-foreground">{appointment.patientName}</p>
                                <p className="text-sm text-muted-foreground">{appointment.type}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                {appointment.time}
                            </div>

                            <Badge
                                variant="outline"
                                className={cn("capitalize", statusStyles[appointment.status])}
                            >
                                {appointment.status}
                            </Badge>

                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    )
}
